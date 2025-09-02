import React from 'react';
import { Calendar, TrendingUp, Map, Plus, Bell, Settings, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useUserProfile } from '@/hooks/useUserProfile';
import { User } from '@supabase/supabase-js';

export default function Dashboard() {
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [user, setUser] = React.useState<User | null>(null);
  const { profile } = useUserProfile(user);

  React.useEffect(() => {
    // Get current user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const navItems = [
    { icon: TrendingUp, label: 'My Posts', href: '#' },
    { icon: Map, label: 'Find Food', href: '#' },
    { icon: Plus, label: 'New Post', href: '#', primary: true },
    { icon: Bell, label: 'Notifications', href: '#' },
    { icon: Settings, label: 'Settings', href: '#' },
  ];

  // Mock data for posts
  const activePosts = [
    {
      id: 1,
      title: "Delicious Pizza Night",
      location: "Downtown Restaurant",
      time: "2 hours ago",
      participants: 12
    },
    {
      id: 2,
      title: "Coffee & Work Session",
      location: "Local Café",
      time: "4 hours ago",
      participants: 8
    },
    {
      id: 3,
      title: "Weekend Brunch Spot",
      location: "Uptown Bistro",
      time: "1 day ago",
      participants: 15
    }
  ];

  const displayName = profile?.first_name 
    ? `${profile.first_name}${profile.last_name ? ` ${profile.last_name}` : ''}`
    : user?.email?.split('@')[0] || 'User';

  const initials = profile?.first_name 
    ? `${profile.first_name[0]}${profile.last_name?.[0] || ''}`.toUpperCase()
    : user?.email?.[0]?.toUpperCase() || 'U';

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-card/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <Calendar className="h-5 w-5" />
            </Button>
            
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border-2 border-border/20">
                <AvatarImage src={profile?.avatar_url || ""} />
                <AvatarFallback className="bg-primary/10 text-primary font-medium text-sm">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <h1 className="text-lg font-medium text-foreground">
                Welcome back, {displayName}!
              </h1>
            </div>
            
            <Button variant="ghost" size="icon" onClick={toggleDarkMode} className="text-muted-foreground hover:text-foreground">
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Navigation Grid */}
        <div className="grid grid-cols-5 gap-3 mb-10">
          {navItems.map((item) => (
            <Card 
              key={item.label} 
              className={`group cursor-pointer transition-all duration-300 hover:scale-[1.02] border ${
                item.primary 
                  ? 'bg-primary text-primary-foreground shadow-lg hover:shadow-xl border-primary/20' 
                  : 'bg-card/80 hover:bg-card border-border/40 hover:border-border/60 hover:shadow-md'
              }`}
            >
              <CardContent className="flex flex-col items-center justify-center p-4 min-h-[100px]">
                <div className={`rounded-full p-2.5 mb-2 transition-colors ${
                  item.primary 
                    ? 'bg-primary-foreground/20' 
                    : 'bg-muted/50 group-hover:bg-muted/70'
                }`}>
                  <item.icon className={`h-5 w-5 ${
                    item.primary 
                      ? 'text-primary-foreground' 
                      : 'text-foreground'
                  }`} />
                </div>
                <span className={`text-xs font-medium text-center ${
                  item.primary 
                    ? 'text-primary-foreground' 
                    : 'text-foreground/90'
                }`}>
                  {item.label}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Active Posts Section */}
        <section>
          <h2 className="text-xl font-semibold text-foreground mb-5">
            Active Posts
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activePosts.map((post) => (
              <Card key={post.id} className="bg-card/80 border-border/40 hover:border-border/60 transition-all duration-200 hover:shadow-md">
                <CardContent className="p-4">
                  <div className="aspect-[4/3] bg-muted/30 rounded-lg mb-3 flex items-center justify-center border border-border/20">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-muted/50 rounded-full mx-auto mb-2 flex items-center justify-center">
                        <Map className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <span className="text-xs text-muted-foreground">Post Image</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium text-sm text-foreground">{post.title}</h3>
                    <p className="text-xs text-muted-foreground">{post.location}</p>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-muted-foreground">{post.time}</span>
                      <span className="text-primary font-medium">{post.participants} joined</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}