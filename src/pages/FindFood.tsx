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
import { findLocationCoordinates, getLocationTypeColor } from '@/utils/sewaneeLocations';

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
      infoWindow?: InfoWindow; // Add custom property
    }
    class InfoWindow {
      constructor(opts?: InfoWindowOptions);
      open(map: Map, anchor?: Marker): void;
      close(): void;
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
      maxWidth?: number;
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

  const { data: foodPosts = [], refetch } = useQuery({
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

  // Set up real-time subscription for new posts
  useEffect(() => {
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'food_posts'
        },
        (payload) => {
          console.log('New post added:', payload);
          refetch(); // Refetch data when new post is added
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'food_posts'
        },
        (payload) => {
          console.log('Post updated:', payload);
          refetch(); // Refetch data when post is updated
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  const filteredPosts = React.useMemo(() => {
    console.log('All food posts:', foodPosts);
    console.log('Current user:', currentUser);
    console.log('Filter mode:', filterMode);
    
    const activePosts = foodPosts.filter(post => 
      new Date(post.expires_at) > new Date()
    );

    console.log('Active posts (not expired):', activePosts);

    switch (filterMode) {
      case 'my':
        const myPosts = activePosts.filter(post => currentUser && post.user_id === currentUser.id);
        console.log('My posts:', myPosts);
        return myPosts;
      case 'nearby':
        // For demo purposes, showing all posts within Sewanee area (1.5 mile radius)
        console.log('Nearby posts:', activePosts);
        return activePosts;
      default:
        console.log('All posts:', activePosts);
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
    console.log('Map effect triggered. Filtered posts:', filteredPosts);
    
    if (!mapInstanceRef.current) {
      console.log('Map instance not ready');
      return;
    }

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];
    console.log('Cleared existing markers');

    if (!filteredPosts.length) {
      console.log('No filtered posts to display');
      return;
    }

    // Add new markers for filtered posts
    filteredPosts.forEach((post, index) => {
      console.log(`Processing post ${index + 1}:`, post);
      
      // Get coordinates for the post location
      const coordinates = findLocationCoordinates(post.location);
      console.log(`Coordinates for "${post.location}":`, coordinates);
      
      if (!coordinates) {
        console.log(`No coordinates found for location: ${post.location}`);
        return;
      }

      // Create custom marker icon based on post type
      const markerIcon = {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 12,
        fillColor: '#10b981',
        fillOpacity: 0.9,
        strokeColor: '#ffffff',
        strokeWeight: 3,
      };

      const marker = new google.maps.Marker({
        position: coordinates,
        map: mapInstanceRef.current,
        title: post.title,
        icon: markerIcon,
      });

      console.log(`Created marker for post: ${post.title} at`, coordinates);

      // Create rich info window with post details and image
      const imageHtml = post.image_url ? 
        `<img src="${post.image_url}" alt="${post.title}" style="width: 120px; height: 80px; object-fit: cover; border-radius: 6px; margin-bottom: 8px; display: block;" onerror="this.style.display='none'" />` 
        : '';

      const timeAgo = new Date(post.created_at).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });

      const expiresAt = new Date(post.expires_at).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 12px; max-width: 200px; font-family: Arial, sans-serif;">
            ${imageHtml}
            <div style="margin-bottom: 8px;">
              <h3 style="margin: 0 0 4px 0; font-size: 16px; font-weight: bold; color: #1f2937;">${post.title}</h3>
              <p style="margin: 0 0 6px 0; font-size: 13px; color: #4b5563; line-height: 1.4;">${post.description}</p>
              <div style="display: flex; align-items: center; font-size: 12px; color: #6b7280; margin-bottom: 4px;">
                <span style="margin-right: 4px;">📍</span> 
                <span style="font-weight: 500;">${post.location}</span>
              </div>
              ${post.servings ? `
                <div style="display: flex; align-items: center; font-size: 12px; color: #6b7280; margin-bottom: 4px;">
                  <span style="margin-right: 4px;">🍽️</span> 
                  <span>Servings: ${post.servings}</span>
                </div>
              ` : ''}
              <div style="display: flex; justify-content: space-between; font-size: 11px; color: #9ca3af; padding-top: 6px; border-top: 1px solid #e5e7eb;">
                <span>Posted: ${timeAgo}</span>
                <span>Expires: ${expiresAt}</span>
              </div>
              <div style="text-align: center; margin-top: 6px;">
                <span style="display: inline-block; background-color: #dcfce7; color: #166534; padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: 500;">
                  Available Now
                </span>
              </div>
            </div>
          </div>
        `,
        maxWidth: 250,
      });

      console.log(`Created info window for: ${post.title}`);

      // Add click listener to marker
      marker.addListener('click', () => {
        console.log(`Marker clicked for: ${post.title}`);
        // Close all other info windows
        markersRef.current.forEach(m => {
          if (m !== marker && (m as any).infoWindow) {
            ((m as any).infoWindow as google.maps.InfoWindow).close();
          }
        });
        infoWindow.open(mapInstanceRef.current, marker);
      });

      // Store info window reference on marker for later access
      (marker as any).infoWindow = infoWindow;

      markersRef.current.push(marker);
      console.log(`Added marker ${index + 1} to markers array. Total markers: ${markersRef.current.length}`);
    });
    
    console.log(`Finished processing ${filteredPosts.length} posts. Total markers created: ${markersRef.current.length}`);
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