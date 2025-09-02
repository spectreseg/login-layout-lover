import React from 'react';
import { Calendar, TrendingUp, Map, Plus, Bell, Settings, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';

export default function Dashboard() {
  const [isDarkMode, setIsDarkMode] = React.useState(false);

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

  const activePosts = Array.from({ length: 3 }, (_, i) => ({ id: i }));

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <Calendar className="h-5 w-5" />
            </Button>
            
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src="" />
                <AvatarFallback className="bg-muted text-muted-foreground">
                  U
                </AvatarFallback>
              </Avatar>
              <h1 className="text-xl font-medium text-foreground">
                Welcome back, User!
              </h1>
            </div>
            
            <Button variant="ghost" size="icon" onClick={toggleDarkMode} className="text-muted-foreground">
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Navigation Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
          {navItems.map((item) => (
            <Card 
              key={item.label} 
              className={`group cursor-pointer transition-all duration-200 hover:shadow-md border ${
                item.primary 
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                  : 'bg-card hover:bg-accent'
              }`}
            >
              <CardContent className="flex flex-col items-center justify-center p-6 min-h-[120px]">
                <div className={`rounded-full p-3 mb-3 ${
                  item.primary 
                    ? 'bg-primary-foreground/20' 
                    : 'bg-muted group-hover:bg-muted/80'
                }`}>
                  <item.icon className={`h-6 w-6 ${
                    item.primary 
                      ? 'text-primary-foreground' 
                      : 'text-foreground'
                  }`} />
                </div>
                <span className={`text-sm font-medium ${
                  item.primary 
                    ? 'text-primary-foreground' 
                    : 'text-foreground'
                }`}>
                  {item.label}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Active Posts Section */}
        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-6">
            Active Posts
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activePosts.map((post) => (
              <Card key={post.id} className="bg-card border-border">
                <CardContent className="p-6">
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <span className="text-muted-foreground text-sm">Post Content</span>
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