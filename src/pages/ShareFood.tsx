import React, { useState } from 'react';
import { Camera, ArrowLeft, MapPin, Users, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import StarryBackground from '@/components/StarryBackground';

// @ts-ignore - HEIC convert library  
import heic2any from 'heic2any';

export default function ShareFood() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    servings: '',
    availableUntil: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const convertHeicToJpeg = async (file: File): Promise<File> => {
    try {
      console.log('Converting HEIC file:', file.name, file.type);
      
      // Create a canvas to convert the image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas not supported');

      // Create image element
      const img = new Image();
      
      return new Promise((resolve, reject) => {
        img.onload = () => {
          try {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            
            canvas.toBlob((blob) => {
              if (blob) {
                const newFileName = file.name.replace(/\.(heic|HEIC)$/i, '.jpg');
                const convertedFile = new File([blob], newFileName, {
                  type: 'image/jpeg',
                });
                console.log('HEIC conversion successful:', convertedFile.name);
                resolve(convertedFile);
              } else {
                reject(new Error('Canvas conversion failed'));
              }
            }, 'image/jpeg', 0.8);
          } catch (error) {
            reject(error);
          }
        };
        
        img.onerror = () => {
          reject(new Error('Failed to load HEIC image'));
        };
        
        // Convert file to blob URL for the image
        img.src = URL.createObjectURL(file);
      });
    } catch (error) {
      console.error('HEIC conversion failed:', error);
      // Return original file if conversion fails
      console.log('Falling back to original file');
      return file;
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log('File selected:', file.name, file.type, file.size);
    setIsUploading(true);
    
    try {
      let processedFile = file;
      
      // Check if file is HEIC and convert it
      const isHeic = file.type === 'image/heic' || 
                     file.type === 'image/HEIC' || 
                     file.name.toLowerCase().endsWith('.heic') ||
                     file.name.toLowerCase().endsWith('.HEIC');
      
      if (isHeic) {
        console.log('Detected HEIC file, converting...');
        try {
          processedFile = await convertHeicToJpeg(file);
        } catch (conversionError) {
          console.warn('HEIC conversion failed, using original file:', conversionError);
          // Use original file if conversion fails
          processedFile = file;
        }
      }
      
      setImageFile(processedFile);
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(processedFile);
      setImagePreview(previewUrl);
      console.log('Image processing complete, preview created');
    } catch (error) {
      console.error('Error processing image:', error);
      alert(`Failed to process image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual submission logic
    console.log('Form submitted:', { formData, imageFile });
    alert('Food post created successfully!');
    navigate('/dashboard');
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <main className="w-full px-6 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-white border-border/30 shadow-xl rounded-2xl overflow-hidden">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                {/* Header with Back Button and Tiger */}
                <div className="flex items-center justify-center mb-6 relative">
                  <Button
                    variant="ghost"
                    onClick={handleCancel}
                    className="absolute left-0 flex items-center gap-2 text-foreground/80 hover:text-foreground hover:bg-muted/50 transition-all duration-200"
                  >
                    <ArrowLeft className="h-5 w-5" />
                    Back to Dashboard
                  </Button>
                  
                  {/* Tiger Image */}
                  <div className="w-24 h-24 animate-fade-in">
                    <img 
                      src="/lovable-uploads/3a3c3b4a-16c4-4156-b27c-44f006547e86.png" 
                      alt="Monte Tiger" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
                
                <h2 className="text-4xl font-playfair font-bold text-foreground mb-3 tracking-wide animate-fade-in">
                  Share Food
                </h2>
                <p className="text-muted-foreground font-inter text-lg leading-relaxed animate-fade-in">
                  Help reduce waste by sharing leftover food with your community
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in"
                    style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
                {/* Photo Upload */}
                <div className="space-y-4">
                  <Label className="text-lg font-inter font-semibold text-foreground">
                    Photo (Optional)
                  </Label>
                  <div className="flex gap-6">
                    <div className="flex-shrink-0">
                      <label className="block">
                        <input
                          type="file"
                          accept="image/*,.heic,.HEIC"
                          onChange={handleImageUpload}
                          className="hidden"
                          disabled={isUploading}
                        />
                        <div className="w-40 h-40 border-2 border-dashed border-primary/30 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-all duration-200 bg-gradient-to-br from-muted/20 to-muted/40 hover:from-muted/30 hover:to-muted/50 group">
                          {isUploading ? (
                            <div className="flex flex-col items-center justify-center">
                              <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mb-2"></div>
                              <div className="text-muted-foreground text-sm font-medium">Processing...</div>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center justify-center">
                              <Camera className="h-10 w-10 text-muted-foreground group-hover:text-primary transition-colors mb-2" />
                              <div className="text-muted-foreground text-sm font-medium">
                                Click to upload
                              </div>
                            </div>
                          )}
                        </div>
                      </label>
                    </div>
                    <div className="flex-1 max-w-md">
                      {imagePreview ? (
                        <div className="bg-gradient-to-br from-muted/20 to-muted/40 rounded-xl p-4 h-40 flex items-center justify-center border border-border/20">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="max-h-full max-w-full object-contain rounded-lg shadow-sm"
                          />
                        </div>
                      ) : (
                        <div className="bg-gradient-to-br from-muted/20 to-muted/40 rounded-xl p-4 h-40 flex items-center justify-center border border-border/20">
                          <span className="text-muted-foreground font-inter text-lg">Preview</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Food Title */}
                <div className="space-y-4">
                  <Label htmlFor="title" className="text-lg font-inter font-semibold text-foreground">
                    Food Title <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="e.g., Pizza from event, Leftover sandwiches"
                    required
                    className="h-14 text-lg font-inter bg-white border-border/40 focus:border-primary rounded-xl shadow-sm"
                  />
                </div>

                {/* Description */}
                <div className="space-y-4">
                  <Label htmlFor="description" className="text-lg font-inter font-semibold text-foreground">
                    Description <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe the food, any allergens, pickup instructions..."
                    required
                    rows={4}
                    className="text-lg font-inter bg-white border-border/40 focus:border-primary resize-none rounded-xl shadow-sm"
                  />
                </div>

                {/* Pickup Location */}
                <div className="space-y-4">
                  <Label htmlFor="location" className="text-lg font-inter font-semibold text-foreground flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Pickup Location <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="e.g., Gailor Hall lobby, McClurg dining hall"
                    required
                    className="h-14 text-lg font-inter bg-white border-border/40 focus:border-primary rounded-xl shadow-sm"
                  />
                </div>

                {/* Bottom Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Number of Servings */}
                  <div className="space-y-4">
                    <Label className="text-lg font-inter font-semibold text-foreground flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      Number of Servings
                    </Label>
                    <Select value={formData.servings} onValueChange={(value) => handleInputChange('servings', value)}>
                      <SelectTrigger className="h-14 text-lg font-inter bg-white border-border/40 rounded-xl shadow-sm">
                        <SelectValue placeholder="Optional" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 25, 30].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} serving{num !== 1 ? 's' : ''}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Available Until */}
                  <div className="space-y-4">
                    <Label htmlFor="availableUntil" className="text-lg font-inter font-semibold text-foreground flex items-center gap-2">
                      <Clock className="h-5 w-5 text-primary" />
                      Available Until <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="availableUntil"
                      type="datetime-local"
                      value={formData.availableUntil}
                      onChange={(e) => handleInputChange('availableUntil', e.target.value)}
                      required
                      className="h-14 text-lg font-inter bg-white border-border/40 focus:border-primary rounded-xl shadow-sm"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-6 pt-8">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    className="flex-1 h-14 text-lg font-inter font-semibold rounded-xl border-2 hover:bg-muted/50 transition-all duration-200"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 h-14 text-lg bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 font-inter font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover-scale"
                  >
                    Share Food
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}