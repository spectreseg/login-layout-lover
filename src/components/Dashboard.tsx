import React from 'react';
import { LogOut, TrendingUp, Map, Plus, Bell, Settings, Moon, Sun, MapPin, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useUserProfile } from '@/hooks/useUserProfile';
import { User } from '@supabase/supabase-js';
import pizzaImage from '@/assets/food-pizza.jpg';
import bagelsImage from '@/assets/food-bagels.jpg';
import sandwichesImage from '@/assets/food-sandwiches.jpg';
import saladImage from '@/assets/food-salad.jpg';
import fruitImage from '@/assets/food-fruit.jpg';
import pastaImage from '@/assets/food-pasta.jpg';

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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  const navItems = [
    { icon: TrendingUp, label: 'My Posts', href: '#' },
    { icon: Map, label: 'Find Food', href: '#' },
    { icon: Plus, label: 'New Post', href: '#', primary: true },
    { icon: Bell, label: 'Notifications', href: '#' },
    { icon: Settings, label: 'Settings', href: '#' },
  ];

  // Mock data for posts with Sewanee TN campus locations
  const activePosts = [
    {
      id: 1,
      title: "Leftover pizza from study group",
      description: "We ordered too much pizza during our late-night study session. Still warm and delicious!",
      location: "Gailor Hall, outside main entrance",
      timeLeft: "Expires in 45 minutes",
      servings: 8,
      postedBy: "Sarah Williams",
      status: "Available",
      image: pizzaImage
    },
    {
      id: 2,
      title: "Faculty meeting bagels & cream cheese",
      description: "Fresh bagels and assorted cream cheese from this morning's faculty meeting.",
      location: "Carnegie Hall, faculty lounge",
      timeLeft: "Expires in 2 hours",
      servings: 12,
      postedBy: "Dr. Johnson",
      status: "Available",
      image: bagelsImage
    },
    {
      id: 3,
      title: "Dining hall surplus sandwiches",
      description: "McClurg has extra sandwiches from today's lunch service. Various options available.",
      location: "McClurg Dining Hall, outside",
      timeLeft: "Expires in 1 hour",
      servings: 15,
      postedBy: "Dining Services",
      status: "Available",
      image: sandwichesImage
    },
    {
      id: 4,
      title: "Fresh salad bowl from catering",
      description: "Large mixed greens salad with vinaigrette dressing available. Perfect for a light and healthy meal.",
      location: "Spencer Hall, conference room",
      timeLeft: "Expires in 3 hours",
      servings: 6,
      postedBy: "Event Catering",
      status: "Available",
      image: saladImage
    },
    {
      id: 5,
      title: "Fruit platter from orientation",
      description: "Beautiful assorted fruit platter from new student orientation. Fresh and colorful!",
      location: "Convocation Hall, lobby",
      timeLeft: "Expires in 30 minutes",
      servings: 20,
      postedBy: "Admissions Office",
      status: "Available",
      image: fruitImage
    },
    {
      id: 6,
      title: "Pasta dinner leftovers",
      description: "Homemade pasta with marinara sauce from our dorm floor dinner. Plenty left over!",
      location: "Benedict Hall, 3rd floor kitchen",
      timeLeft: "Expires in 4 hours",
      servings: 10,
      postedBy: "Floor RA Team",
      status: "Available",
      image: pastaImage
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
      <header className="border-b border-border/20 bg-card/50 backdrop-blur-sm">
        <div className="w-full px-4 py-3">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleDarkMode} 
              className="text-muted-foreground hover:text-foreground"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8 border border-border/30">
                <AvatarImage 
                  src={profile?.avatar_url || ""} 
                  className="object-cover"
                />
                <AvatarFallback className="bg-primary/10 text-primary font-medium text-xs">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <h1 className="text-base font-medium text-foreground">
                Welcome back, {displayName}!
              </h1>
            </div>
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleSignOut}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full px-4 py-6">
        {/* Navigation Grid */}
        <div className="grid grid-cols-5 gap-2 mb-8">
          {navItems.map((item) => (
            <Card 
              key={item.label} 
              className={`group cursor-pointer transition-all duration-200 hover:scale-[1.02] border ${
                item.primary 
                  ? 'bg-primary text-primary-foreground shadow-md hover:shadow-lg border-primary/20' 
                  : 'bg-card/60 hover:bg-card border-border/30 hover:border-border/50 hover:shadow-sm'
              }`}
            >
              <CardContent className="flex flex-col items-center justify-center p-3 min-h-[80px]">
                <div className={`rounded-full p-2 mb-1.5 transition-colors ${
                  item.primary 
                    ? 'bg-primary-foreground/20' 
                    : 'bg-muted/40 group-hover:bg-muted/60'
                }`}>
                  <item.icon className={`h-4 w-4 ${
                    item.primary 
                      ? 'text-primary-foreground' 
                      : 'text-foreground/80'
                  }`} />
                </div>
                <span className={`text-xs font-medium text-center leading-tight ${
                  item.primary 
                    ? 'text-primary-foreground' 
                    : 'text-foreground/80'
                }`}>
                  {item.label}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Active Posts Section */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Active Posts
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activePosts.map((post) => (
              <Card key={post.id} className="bg-card border-border/30 hover:border-border/50 transition-all duration-200 hover:shadow-sm overflow-hidden">
                <div className="aspect-[4/3] bg-muted/20 relative overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                  <Badge 
                    variant="secondary" 
                    className="absolute top-2 right-2 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                  >
                    {post.status}
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-medium text-sm text-foreground leading-tight mb-1">
                        {post.title}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {post.description}
                      </p>
                    </div>
                    
                    <div className="space-y-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{post.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{post.timeLeft}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>{post.servings} servings</span>
                      </div>
                      <div className="text-xs text-foreground/70">
                        by {post.postedBy}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button variant="ghost" size="sm" className="flex-1 text-xs h-8 text-primary">
                        View Details
                      </Button>
                      <Button size="sm" className="flex-1 text-xs h-8 bg-primary hover:bg-primary/90">
                        I'm On My Way!
                      </Button>
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