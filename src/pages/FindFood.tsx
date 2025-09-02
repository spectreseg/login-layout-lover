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
      addListener(eventName: string, handler: (event?: any) => void): void;
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
      draggable?: boolean;
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

  // Dummy posts with exact Sewanee locations for demo
  const dummyPosts = [
    {
      id: 'dummy-1',
      user_id: 'dummy-user-1',
      title: 'Homemade Margherita Pizza',
      description: 'Fresh basil, mozzarella, and tomato sauce on homemade dough. Made too much for dinner tonight!',
      location: 'Stirling Coffee House',
      servings: '6-8 slices',
      image_url: '/assets/dummy-pizza-DzZu7eHL.jpg',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
      finished_by: [],
    },
    {
      id: 'dummy-2', 
      user_id: 'dummy-user-2',
      title: 'Fresh Garden Salad',
      description: 'Mixed greens with cherry tomatoes, cucumbers, and house vinaigrette. Perfect for a healthy lunch!',
      location: 'McClurg Dining Hall',
      servings: '4-6 people',
      image_url: '/assets/dummy-salad-DLDokZKN.jpg',
      created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      expires_at: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
      finished_by: [],
    },
    {
      id: 'dummy-3',
      user_id: 'dummy-user-3', 
      title: 'Seasonal Fruit Bowl',
      description: 'Fresh strawberries, blueberries, and kiwi from the farmers market. Great for sharing!',
      location: 'Blue Chair Tavern',
      servings: '8-10 people',
      image_url: '/assets/dummy-fruit-Dk5_c-Co.jpg',
      created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      expires_at: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(),
      finished_by: [],
    },
    {
      id: 'dummy-6',
      user_id: 'dummy-user-6',
      title: 'Creamy Italian Pasta',
      description: 'Penne with herbs, vegetables, and parmesan. Comfort food at its finest!',
      location: 'Benedict Hall',
      servings: '6-8 people',
      image_url: '/assets/dummy-pasta-B4dvg6oP.jpg',
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      expires_at: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
      finished_by: [],
    }
  ];

  const { data: realFoodPosts = [], refetch } = useQuery({
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

  // Combine real posts with dummy posts
  const allFoodPosts = [...realFoodPosts, ...dummyPosts];

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
    console.log('All food posts (real + dummy):', allFoodPosts);
    console.log('Current user:', currentUser);
    console.log('Filter mode:', filterMode);
    
    const activePosts = allFoodPosts.filter(post => 
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
  }, [allFoodPosts, filterMode, currentUser]);

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

      // Create custom marker icon with food emoji
      const markerIcon = {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 15,
        fillColor: '#ef4444',
        fillOpacity: 0.9,
        strokeColor: '#ffffff',
        strokeWeight: 3,
      };

      const marker = new google.maps.Marker({
        position: coordinates,
        map: mapInstanceRef.current,
        title: `${post.title} at ${post.location}`,
        icon: markerIcon,
        draggable: true,
      });

      // Add drag end listener to log new position
      marker.addListener('dragend', (event: any) => {
        const newPosition = {
          lat: event.latLng.lat(),
          lng: event.latLng.lng()
        };
        console.log(`${post.location} dragged to:`, newPosition);
        console.log(`Update coordinates for ${post.location}: { lat: ${newPosition.lat}, lng: ${newPosition.lng} }`);
      });

      console.log(`Created marker for post: ${post.title} at`, coordinates);

      // Create rich info window with post details and image
      const imageHtml = post.image_url ? 
        `<div style="text-align: center; margin-bottom: 12px;">
          <img src="${post.image_url}" alt="${post.title}" 
               style="width: 160px; height: 120px; object-fit: cover; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.15);" 
               onload="this.style.display='block'" 
               onerror="this.style.display='none'" />
        </div>` 
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
          <div style="padding: 12px; max-width: 200px; font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.4;">
            ${imageHtml}
            <div style="text-align: center; margin-bottom: 8px;">
              <h3 style="margin: 0 0 4px 0; font-size: 16px; font-weight: 600; color: #1f2937;">${post.title}</h3>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 12px; color: #6b7280; margin-bottom: 6px;">
              <span>Expires: ${expiresAt}</span>
            </div>
            <div style="text-align: center;">
              <span style="display: inline-block; background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 3px 10px; border-radius: 16px; font-size: 11px; font-weight: 500;">
                Available Now
              </span>
            </div>
          </div>
        `,
        maxWidth: 240,
      });

      console.log(`Created info window for: ${post.title}`);

      // Add click listener to marker
      marker.addListener('click', () => {
        console.log(`Marker clicked for: ${post.title}`);
        // Close all other info windows first
        markersRef.current.forEach(m => {
          if (m !== marker && (m as any).infoWindow) {
            ((m as any).infoWindow as google.maps.InfoWindow).close();
          }
        });
        // Open this info window
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