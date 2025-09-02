import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Button } from '@/components/ui/button';
import { Toggle } from '@/components/ui/toggle';
import { ArrowLeft, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUserProfile } from '@/hooks/useUserProfile';
import type { User } from '@supabase/supabase-js';

// Google Maps type declarations
declare global {
  interface Window {
    google: typeof google;
  }
}

declare namespace google {
  namespace maps {
    class Map {
      constructor(mapDiv: Element, opts?: MapOptions);
    }
    class Marker {
      constructor(opts?: MarkerOptions);
      addListener(eventName: string, handler: () => void): void;
      setMap(map: Map | null): void;
    }
    class InfoWindow {
      constructor(opts?: InfoWindowOptions);
      open(map: Map, anchor?: Marker): void;
    }
    interface MapOptions {
      center?: LatLngLiteral;
      zoom?: number;
      restriction?: MapRestriction;
      mapTypeControl?: boolean;
      streetViewControl?: boolean;
      fullscreenControl?: boolean;
      styles?: MapTypeStyle[];
    }
    interface LatLngLiteral {
      lat: number;
      lng: number;
    }
    interface MarkerOptions {
      position?: LatLngLiteral;
      map?: Map;
      title?: string;
      icon?: any;
    }
    interface InfoWindowOptions {
      content?: string;
    }
    interface MapRestriction {
      latLngBounds: LatLngBoundsLiteral;
      strictBounds: boolean;
    }
    interface LatLngBoundsLiteral {
      north: number;
      south: number;
      east: number;
      west: number;
    }
    interface MapTypeStyle {
      featureType?: string;
      elementType?: string;
      stylers?: Array<{ visibility?: string }>;
    }
    enum SymbolPath {
      CIRCLE = 0,
    }
  }
}

interface FoodPost {
  id: string;
  title: string;
  description: string;
  location: string;
  image_url?: string;
  created_at: string;
  expires_at: string;
  finished_by: string[];
  user_id: string;
  servings?: string;
}

const SEWANEE_CENTER = { lat: 35.2042, lng: -85.9217 };

const FindFood = () => {
  const navigate = useNavigate();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const { profile } = useUserProfile(currentUser);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
    };
    getUser();
  }, []);
  
  const [filterMode, setFilterMode] = useState<'nearby' | 'all' | 'my'>('all');

  const { data: foodPosts = [] } = useQuery({
    queryKey: ['food-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('food_posts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as FoodPost[];
    },
  });

  const filteredPosts = React.useMemo(() => {
    if (!currentUser) return [];
    
    const activePosts = foodPosts.filter(post => 
      new Date(post.expires_at) > new Date() && 
      !post.finished_by.includes(currentUser.id)
    );

    switch (filterMode) {
      case 'my':
        return activePosts.filter(post => post.user_id === currentUser.id);
      case 'nearby':
        // For demo purposes, showing all posts within Sewanee area (1.5 mile radius)
        return activePosts;
      default:
        return activePosts;
    }
  }, [foodPosts, filterMode, currentUser]);

  useEffect(() => {
    const initializeMap = async () => {
      if (!mapRef.current) return;

      const loader = new Loader({
        apiKey: 'AIzaSyB6XX04Q4rzeYA5W6KseYMdPh0cZxeJYyg',
        version: 'weekly',
        libraries: ['places'],
      });

      try {
        await loader.load();
        
        const map = new google.maps.Map(mapRef.current, {
          center: SEWANEE_CENTER,
          zoom: 15,
          restriction: {
            latLngBounds: {
              north: 35.2142,
              south: 35.1942,
              east: -85.9117,
              west: -85.9317,
            },
            strictBounds: true,
          },
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }],
            },
          ],
        });

        mapInstanceRef.current = map;
      } catch (error) {
        console.error('Error loading Google Maps:', error);
      }
    };

    initializeMap();
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current || !filteredPosts.length) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Add new markers for filtered posts
    filteredPosts.forEach((post, index) => {
      // Generate random coordinates within Sewanee campus area
      const lat = SEWANEE_CENTER.lat + (Math.random() - 0.5) * 0.008;
      const lng = SEWANEE_CENTER.lng + (Math.random() - 0.5) * 0.008;

      const marker = new google.maps.Marker({
        position: { lat, lng },
        map: mapInstanceRef.current,
        title: post.title,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: '#10b981',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
        },
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div class="p-2 max-w-xs">
            <h3 class="font-semibold text-sm">${post.title}</h3>
            <p class="text-xs text-gray-600 mt-1">${post.description}</p>
            <p class="text-xs text-gray-500 mt-1 flex items-center">
              <span class="mr-1">📍</span> ${post.location}
            </p>
            ${post.servings ? `<p class="text-xs text-gray-500">Servings: ${post.servings}</p>` : ''}
          </div>
        `,
      });

      marker.addListener('click', () => {
        infoWindow.open(mapInstanceRef.current, marker);
      });

      markersRef.current.push(marker);
    });
  }, [filteredPosts]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-3 flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Dashboard
        </Button>

        <div className="flex items-center gap-2">
          <Toggle
            pressed={filterMode === 'nearby'}
            onPressedChange={() => setFilterMode(filterMode === 'nearby' ? 'all' : 'nearby')}
            variant="outline"
            size="sm"
          >
            <MapPin className="h-3 w-3 mr-1" />
            Nearby
          </Toggle>
          <Toggle
            pressed={filterMode === 'all'}
            onPressedChange={() => setFilterMode('all')}
            variant="outline"
            size="sm"
          >
            All Posts
          </Toggle>
          <Toggle
            pressed={filterMode === 'my'}
            onPressedChange={() => setFilterMode('my')}
            variant="outline"
            size="sm"
          >
            My Posts
          </Toggle>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative h-[calc(100vh-73px)]">
        <div ref={mapRef} className="w-full h-full" />
        
        {/* Post count indicator */}
        <div className="absolute top-4 left-4 bg-card/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border border-border">
          <p className="text-sm font-medium">
            {filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''} found
          </p>
        </div>
      </div>
    </div>
  );
};

export default FindFood;