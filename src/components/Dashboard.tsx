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
    <div className="min-h-screen bg-gradient-to-br from-background via-accent-blue/5 to-primary/5">
      {/* Header */}
      <header className="border-b border-border/20 bg-gradient-hero backdrop-blur-sm shadow-nav">
        <div className="w-full px-4 py-4">
          <div className="flex items-center justify-center gap-48">
            <div className="flex flex-col items-center gap-3 cursor-pointer group">
              <div className="w-12 h-12 bg-transparent flex items-center justify-center group-hover:bg-muted/50 rounded-lg transition-colors duration-200">
                <button onClick={toggleDarkMode}>
                  {isDarkMode ? <Sun className="h-6 w-6 text-foreground/80 group-hover:text-foreground" /> : <Moon className="h-6 w-6 text-foreground/80 group-hover:text-foreground" />}
                </button>
              </div>
            </div>
            
            <div className="flex items-center gap-5">
              <Avatar className="h-20 w-20 border-2 border-border/30">
                <AvatarImage 
                  src={profile?.avatar_url || ""} 
                  className="object-cover"
                />
                <AvatarFallback className="bg-primary/10 text-primary font-bold text-2xl">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <h1 className="text-4xl font-playfair font-semibold text-foreground tracking-wide">
                Welcome back, {displayName}!
              </h1>
            </div>
            
            <div className="flex flex-col items-center gap-3 cursor-pointer group">
              <div className="w-12 h-12 bg-transparent flex items-center justify-center group-hover:bg-muted/50 rounded-lg transition-colors duration-200">
                <button onClick={handleSignOut}>
                  <LogOut className="h-6 w-6 text-destructive group-hover:text-destructive" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full px-4 py-3">
        {/* Navigation Grid */}
        <div className="flex items-center justify-between px-8 py-6 mb-4 bg-gradient-nav backdrop-blur-sm mx-4 rounded-xl shadow-nav border border-accent-blue/10">
          {navItems.map((item) => (
            <div 
              key={item.label} 
              className="flex flex-col items-center gap-3 cursor-pointer group"
            >
              {item.primary ? (
                <div className="w-16 h-16 bg-gradient-purple rounded-full flex items-center justify-center shadow-auth-button hover:shadow-xl transition-all duration-300 hover:scale-110 hover:bg-gradient-purple-hover">
                  <item.icon className="h-7 w-7 text-primary-foreground" />
                </div>
              ) : (
                <div className="w-12 h-12 bg-transparent flex items-center justify-center group-hover:bg-accent-blue/10 rounded-xl transition-all duration-300 hover:shadow-md border border-transparent group-hover:border-accent-blue/20">
                  <item.icon className="h-6 w-6 text-foreground/80 group-hover:text-accent-blue transition-colors duration-300" />
                </div>
              )}
              <span className={`font-inter font-medium text-center tracking-wide transition-colors duration-300 ${
                item.primary 
                  ? 'text-sm text-foreground' 
                  : 'text-sm text-foreground/80 group-hover:text-accent-blue'
              }`}>
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Active Posts Section */}
        <section>
          <h2 className="text-2xl font-playfair font-semibold text-foreground mb-6 tracking-wide">
            Active Posts
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activePosts.map((post, index) => {
              const cardColors = [
                'bg-gradient-to-br from-accent-blue/10 to-accent-blue/5 border-accent-blue/20',
                'bg-gradient-to-br from-accent-green/10 to-accent-green/5 border-accent-green/20',
                'bg-gradient-to-br from-accent-orange/10 to-accent-orange/5 border-accent-orange/20',
                'bg-gradient-to-br from-accent-pink/10 to-accent-pink/5 border-accent-pink/20',
                'bg-gradient-to-br from-accent-teal/10 to-accent-teal/5 border-accent-teal/20',
                'bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20'
              ];
              const badgeColors = [
                'bg-accent-blue/10 text-accent-blue border border-accent-blue/20',
                'bg-accent-green/10 text-accent-green border border-accent-green/20',
                'bg-accent-orange/10 text-accent-orange border border-accent-orange/20',
                'bg-accent-pink/10 text-accent-pink border border-accent-pink/20',
                'bg-accent-teal/10 text-accent-teal border border-accent-teal/20',
                'bg-primary/10 text-primary border border-primary/20'
              ];
              
              return (
                <Card key={post.id} className={`${cardColors[index % cardColors.length]} hover:shadow-card transition-all duration-300 hover:scale-[1.02] overflow-hidden border-2`}>
                  <div className="aspect-[4/3] bg-muted/20 relative overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                    <Badge 
                      className={`absolute top-3 right-3 font-medium ${badgeColors[index % badgeColors.length]}`}
                    >
                      {post.status}
                    </Badge>
                  </div>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-inter font-semibold text-base text-foreground leading-tight mb-2 tracking-wide">
                          {post.title}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed font-inter">
                          {post.description}
                        </p>
                      </div>
                      
                      <div className="space-y-2 text-sm text-muted-foreground font-inter">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{post.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{post.timeLeft}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          <span>{post.servings} servings</span>
                        </div>
                        <div className="text-sm text-foreground/70 font-medium">
                          by {post.postedBy}
                        </div>
                      </div>

                      <div className="flex gap-3 pt-3">
                        <Button variant="outline" size="sm" className="flex-1 text-sm h-9 font-inter font-medium border-accent-blue/30 text-accent-blue hover:bg-accent-blue/10 hover:border-accent-blue/50">
                          View Details
                        </Button>
                        <Button size="sm" className="flex-1 text-sm h-9 bg-gradient-purple hover:bg-gradient-purple-hover font-inter font-medium shadow-auth-button hover:shadow-xl transition-all duration-300">
                          I'm On My Way!
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}