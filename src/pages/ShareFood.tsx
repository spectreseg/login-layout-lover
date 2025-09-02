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
      const convertedBlob = await heic2any({
        blob: file,
        toType: "image/jpeg",
        quality: 0.8
      });
      
      // Handle both Blob and Blob[] return types
      const blob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
      
      return new File([blob], file.name.replace(/\.(heic|HEIC)$/i, '.jpg'), {
        type: 'image/jpeg',
      });
    } catch (error) {
      console.error('HEIC conversion failed:', error);
      throw new Error('Failed to convert HEIC image');
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    try {
      let processedFile = file;
      
      // Check if file is HEIC and convert it
      if (file.type === 'image/heic' || file.name.toLowerCase().endsWith('.heic')) {
        processedFile = await convertHeicToJpeg(file);
      }
      
      setImageFile(processedFile);
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(processedFile);
      setImagePreview(previewUrl);
    } catch (error) {
      console.error('Error processing image:', error);
      alert('Failed to process image. Please try another file.');
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
    <div className="min-h-screen bg-background relative">
      <StarryBackground />
      
      {/* Header */}
      <header className="relative z-10 border-b border-border/20 bg-card/50 backdrop-blur-sm">
        <div className="w-full px-6 py-4">
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            <Button
              variant="ghost"
              onClick={handleCancel}
              className="flex items-center gap-2 text-foreground/80 hover:text-foreground"
            >
              <ArrowLeft className="h-5 w-5" />
              Back to Dashboard
            </Button>
            <h1 className="text-2xl font-playfair font-semibold text-foreground tracking-wide">
              Share Food
            </h1>
            <div className="w-32" /> {/* Spacer for center alignment */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 w-full px-6 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-card/90 backdrop-blur border-border/30 shadow-lg">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-playfair font-semibold text-foreground mb-3 tracking-wide">
                  Share Food
                </h2>
                <p className="text-muted-foreground font-inter text-base leading-relaxed">
                  Help reduce waste by sharing leftover food
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Photo Upload */}
                <div className="space-y-3">
                  <Label className="text-base font-inter font-medium text-foreground">
                    Photo (Optional)
                  </Label>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <label className="block">
                        <input
                          type="file"
                          accept="image/*,.heic,.HEIC"
                          onChange={handleImageUpload}
                          className="hidden"
                          disabled={isUploading}
                        />
                        <div className="w-32 h-32 border-2 border-dashed border-border/40 rounded-lg flex items-center justify-center cursor-pointer hover:border-border/60 transition-colors bg-muted/20">
                          {isUploading ? (
                            <div className="text-muted-foreground text-sm">Uploading...</div>
                          ) : (
                            <Camera className="h-8 w-8 text-muted-foreground" />
                          )}
                        </div>
                      </label>
                    </div>
                    {imagePreview && (
                      <div className="flex-1 max-w-md">
                        <div className="bg-muted/30 rounded-lg p-4 h-32 flex items-center justify-center">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="max-h-full max-w-full object-contain rounded"
                          />
                        </div>
                      </div>
                    )}
                    {!imagePreview && (
                      <div className="flex-1 max-w-md">
                        <div className="bg-muted/30 rounded-lg p-4 h-32 flex items-center justify-center">
                          <span className="text-muted-foreground font-inter">Preview</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Food Title */}
                <div className="space-y-3">
                  <Label htmlFor="title" className="text-base font-inter font-medium text-foreground">
                    Food Title <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="e.g., Pizza from event, Leftover sandwiches"
                    required
                    className="h-12 text-base font-inter bg-background/80 border-border/40 focus:border-primary"
                  />
                </div>

                {/* Description */}
                <div className="space-y-3">
                  <Label htmlFor="description" className="text-base font-inter font-medium text-foreground">
                    Description <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe the food, any allergens, pickup instructions..."
                    required
                    rows={4}
                    className="text-base font-inter bg-background/80 border-border/40 focus:border-primary resize-none"
                  />
                </div>

                {/* Pickup Location */}
                <div className="space-y-3">
                  <Label htmlFor="location" className="text-base font-inter font-medium text-foreground flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Pickup Location <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="e.g., Gailor Hall lobby, McClurg dining hall"
                    required
                    className="h-12 text-base font-inter bg-background/80 border-border/40 focus:border-primary"
                  />
                </div>

                {/* Bottom Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Number of Servings */}
                  <div className="space-y-3">
                    <Label className="text-base font-inter font-medium text-foreground flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Number of Servings
                    </Label>
                    <Select value={formData.servings} onValueChange={(value) => handleInputChange('servings', value)}>
                      <SelectTrigger className="h-12 text-base font-inter bg-background/80 border-border/40">
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
                  <div className="space-y-3">
                    <Label htmlFor="availableUntil" className="text-base font-inter font-medium text-foreground flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Available Until <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="availableUntil"
                      type="datetime-local"
                      value={formData.availableUntil}
                      onChange={(e) => handleInputChange('availableUntil', e.target.value)}
                      required
                      className="h-12 text-base font-inter bg-background/80 border-border/40 focus:border-primary"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-6">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleCancel}
                    className="flex-1 h-12 text-base font-inter font-medium"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 h-12 text-base bg-primary hover:bg-primary/90 font-inter font-medium"
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