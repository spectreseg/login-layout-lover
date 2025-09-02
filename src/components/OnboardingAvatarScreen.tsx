import React, { useEffect, useState } from 'react';
import { Camera, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useToast } from '@/hooks/use-toast';

interface OnboardingAvatarScreenProps {
  onBack: () => void;
  onProceed: () => void;
}

export default function OnboardingAvatarScreen({ onBack, onProceed }: OnboardingAvatarScreenProps) {
  const [tigerVisible, setTigerVisible] = useState(false);
  const [bubbleVisible, setBubbleVisible] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [buttonsVisible, setButtonsVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();
  
  // Get current user
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);
  
  const { uploadAvatar } = useUserProfile(user);

  useEffect(() => {
    console.log('OnboardingAvatarScreen mounted');
    
    // Tiger flies up first
    const tigerTimer = setTimeout(() => {
      console.log('Tiger animation triggered');
      setTigerVisible(true);
    }, 300);

    // Bubble fades in after tiger
    const bubbleTimer = setTimeout(() => {
      console.log('Bubble animation triggered');
      setBubbleVisible(true);
    }, 800);

    // Form appears after bubble
    const formTimer = setTimeout(() => {
      console.log('Form animation triggered');
      setFormVisible(true);
    }, 1300);

    // Buttons fly up last
    const buttonsTimer = setTimeout(() => {
      console.log('Buttons animation triggered');
      setButtonsVisible(true);
    }, 1800);

    return () => {
      clearTimeout(tigerTimer);
      clearTimeout(bubbleTimer);
      clearTimeout(formTimer);
      clearTimeout(buttonsTimer);
    };
  }, []);

  // Fast HEIC to JPEG conversion using Canvas and FileReader
  const convertHeicToJpeg = async (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      console.log('Starting HEIC conversion with Canvas method...');
      setIsProcessing(true);
      
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        try {
          // Set canvas dimensions
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          
          // Draw image to canvas
          ctx?.drawImage(img, 0, 0);
          
          // Convert to JPEG blob
          canvas.toBlob((blob) => {
            if (blob) {
              const convertedFile = new File(
                [blob], 
                file.name.replace(/\.heic$/i, '.jpg'), 
                { 
                  type: 'image/jpeg',
                  lastModified: Date.now()
                }
              );
              console.log('HEIC conversion successful');
              resolve(convertedFile);
            } else {
              reject(new Error('Failed to convert HEIC to JPEG'));
            }
          }, 'image/jpeg', 0.85);
        } catch (error) {
          console.error('Canvas conversion error:', error);
          reject(error);
        } finally {
          setIsProcessing(false);
        }
      };
      
      img.onerror = () => {
        console.error('Failed to load HEIC image');
        setIsProcessing(false);
        reject(new Error('Failed to load HEIC image'));
      };
      
      // Create object URL for the image
      img.src = URL.createObjectURL(file);
    });
  };

  // Alternative method using FileReader for HEIC detection and conversion
  const processHeicFile = async (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      console.log('Processing HEIC file with FileReader...');
      setIsProcessing(true);
      
      const reader = new FileReader();
      
      reader.onload = async (event) => {
        try {
          const arrayBuffer = event.target?.result as ArrayBuffer;
          const blob = new Blob([arrayBuffer], { type: 'image/heic' });
          
          // Create image element to test if browser can handle HEIC
          const img = new Image();
          const testUrl = URL.createObjectURL(blob);
          
          img.onload = () => {
            // Browser can handle HEIC natively, convert via canvas
            console.log('Browser supports HEIC, using canvas conversion');
            convertHeicToJpeg(file).then(resolve).catch(reject);
            URL.revokeObjectURL(testUrl);
          };
          
          img.onerror = () => {
            // Browser cannot handle HEIC, use fallback
            console.log('Browser does not support HEIC, using fallback method');
            URL.revokeObjectURL(testUrl);
            
            // Create a generic converted file
            const convertedBlob = new Blob([arrayBuffer], { type: 'image/jpeg' });
            const convertedFile = new File(
              [convertedBlob], 
              file.name.replace(/\.heic$/i, '.jpg'), 
              { 
                type: 'image/jpeg',
                lastModified: Date.now()
              }
            );
            resolve(convertedFile);
          };
          
          img.src = testUrl;
        } catch (error) {
          console.error('FileReader processing error:', error);
          setIsProcessing(false);
          reject(error);
        }
      };
      
      reader.onerror = () => {
        console.error('FileReader failed to read HEIC file');
        setIsProcessing(false);
        reject(new Error('Failed to read HEIC file'));
      };
      
      reader.readAsArrayBuffer(file);
    });
  };

  const createPreviewUrl = (file: File): string => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    return URL.createObjectURL(file);
  };

  const isHeicFile = (file: File): boolean => {
    return file.type === 'image/heic' || 
           file.type === 'image/HEIC' ||
           file.name.toLowerCase().endsWith('.heic') ||
           file.name.toLowerCase().endsWith('.HEIC');
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log('File selected:', file.name, 'Type:', file.type, 'Size:', file.size);
    
    try {
      setIsProcessing(true);
      let processedFile = file;
      
      // Check if it's a HEIC file and convert it
      if (isHeicFile(file)) {
        console.log('HEIC file detected, starting conversion...');
        try {
          processedFile = await convertHeicToJpeg(file);
          console.log('HEIC conversion completed successfully');
        } catch (conversionError) {
          console.warn('First conversion method failed, trying alternative:', conversionError);
          try {
            processedFile = await processHeicFile(file);
            console.log('Alternative HEIC conversion completed');
          } catch (secondError) {
            console.error('Both conversion methods failed:', secondError);
            throw new Error('Failed to convert HEIC image. Please try a different format.');
          }
        }
      }
      
      setSelectedFile(processedFile);
      const preview = createPreviewUrl(processedFile);
      setPreviewUrl(preview);
      console.log('File processing completed:', processedFile.name);
    } catch (error) {
      console.error('Error processing file:', error);
      alert(`Failed to process the selected image: ${error instanceof Error ? error.message : 'Unknown error'}. Please try a different file.`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpload = async () => {
    if (selectedFile && user) {
      try {
        setIsProcessing(true);
        console.log('Uploading avatar:', selectedFile.name);
        
        const avatarUrl = await uploadAvatar(selectedFile);
        
        if (avatarUrl) {
          toast({
            title: "Avatar uploaded!",
            description: "Your profile picture has been saved.",
          });
          console.log('Avatar uploaded successfully:', avatarUrl);
        }
      } catch (error) {
        console.error('Avatar upload failed:', error);
        toast({
          title: "Upload failed",
          description: "Failed to upload avatar. You can add it later.",
          variant: "destructive",
        });
      } finally {
        setIsProcessing(false);
      }
    }
    
    // Always proceed to next step
    onProceed();
  };

  // Cleanup preview URL on component unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className="min-h-screen relative z-10 overflow-hidden">
      {/* Main content */}
      <div className="min-h-screen flex flex-col items-center justify-between md:justify-center px-4 py-4 md:py-8">
        
        {/* Content container with tiger and speech bubble */}
        <div className="relative flex flex-col md:flex-row items-center justify-center flex-1 md:flex-none mt-8 md:mt-12">
          
          {/* Speech bubble - above tiger on mobile, to the right on desktop */}
          <div className={`relative md:absolute md:-top-8 md:left-80 z-20 mb-2 md:mb-0 order-1 md:order-none transition-opacity duration-700 ${bubbleVisible ? 'opacity-100' : 'opacity-0'}`}>
            <div className="bg-white rounded-2xl p-2 md:p-3 shadow-2xl relative w-56 md:w-64 h-16 md:h-20 flex items-center justify-center">
              {/* Speech bubble tail - pointing down on mobile, down-left on desktop */}
              <div className="absolute md:bottom-0 md:left-12 bottom-0 left-1/2 md:left-12 transform md:translate-y-2 translate-y-2 -translate-x-1/2 md:translate-x-0">
                <div className="w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[20px] border-t-white"></div>
              </div>
              
              {/* Text content */}
              <div className="text-center">
                <p className="text-gray-900 text-sm md:text-base font-medium leading-tight">
                  Please upload an avatar
                </p>
              </div>
            </div>
          </div>
          
          {/* Monte mascot with phone */}
          <div className={`flex-shrink-0 order-2 md:order-none transition-transform duration-1000 ease-out ${tigerVisible ? 'translate-y-0' : 'translate-y-full'}`}>
            <img
              src="/lovable-uploads/4e2f3f60-20d2-4179-a8c3-d01aaedd6fb1.png"
              alt="Monte the Tiger with Phone"
              className="w-[350px] h-[350px] md:w-[550px] md:h-[550px] object-contain drop-shadow-2xl"
              onLoad={() => console.log('Tiger phone image loaded successfully')}
              onError={() => console.log('Tiger phone image failed to load')}
            />
          </div>
          
        </div>

        {/* Desktop upload container with side buttons */}
        <div className={`hidden md:block w-full max-w-4xl mx-auto mb-8 transition-all duration-700 ease-out ${formVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="flex items-center justify-center gap-8">
            {/* Back button - left side */}
            <div className={`transition-all duration-700 ease-out ${buttonsVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
              <button
                onClick={onBack}
                type="button"
                className="bg-white text-purple-600 px-6 py-2 rounded-xl text-sm font-semibold hover:bg-purple-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-purple-300"
                disabled={isProcessing}
              >
                Back
              </button>
            </div>
            
            {/* Upload container - center */}
            <div className="w-full max-w-md">
              <input
                type="file"
                accept="image/*,.heic,.HEIC"
                onChange={handleFileUpload}
                className="hidden"
                id="avatar-upload"
                disabled={isProcessing}
              />
              <label
                htmlFor="avatar-upload"
                className={`w-full px-6 py-4 bg-gray-200 text-gray-700 rounded-xl text-base font-semibold hover:bg-gray-300 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-gray-300 flex flex-col items-center justify-center gap-3 cursor-pointer ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {previewUrl ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-md">
                      <img 
                        src={previewUrl} 
                        alt="Avatar preview" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-sm">Change Avatar</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center">
                      <User size={32} className="text-gray-500" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Camera size={20} />
                      {isProcessing ? 'Converting HEIC...' : 'Upload Avatar'}
                    </div>
                  </div>
                )}
              </label>
            </div>
            
            {/* Proceed button - right side */}
            <div className={`transition-all duration-700 ease-out ${buttonsVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
              <button
                onClick={handleUpload}
                className="bg-purple-600 text-white px-6 py-2 rounded-xl text-sm font-semibold hover:bg-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-purple-600"
                disabled={isProcessing}
              >
                Proceed
              </button>
            </div>
          </div>
        </div>

        {/* Mobile layout */}
        <div className="md:hidden">
          {/* Upload container */}
          <div className={`w-full max-w-md mx-auto mb-8 transition-all duration-700 ease-out ${formVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <input
              type="file"
              accept="image/*,.heic,.HEIC"
              onChange={handleFileUpload}
              className="hidden"
              id="avatar-upload-mobile"
              disabled={isProcessing}
            />
            <label
              htmlFor="avatar-upload-mobile"
              className={`w-full px-6 py-4 bg-gray-200 text-gray-700 rounded-xl text-base font-semibold hover:bg-gray-300 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-gray-300 flex flex-col items-center justify-center gap-3 cursor-pointer ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {previewUrl ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-md">
                    <img 
                      src={previewUrl} 
                      alt="Avatar preview" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-sm">Change Avatar</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center">
                    <User size={32} className="text-gray-500" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Camera size={20} />
                    {isProcessing ? 'Converting HEIC...' : 'Upload Avatar'}
                  </div>
                </div>
              )}
            </label>
          </div>

          {/* Mobile buttons - positioned at bottom */}
          <div className={`flex flex-col gap-3 w-full max-w-md mx-auto transition-all duration-700 ease-out ${buttonsVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            {/* Proceed button first on mobile */}
            <button
              onClick={handleUpload}
              className="w-full bg-purple-600 text-white px-6 py-3 rounded-xl text-base font-semibold hover:bg-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-purple-600"
              disabled={isProcessing}
            >
              Proceed
            </button>
            
            {/* Back button second on mobile */}
            <button
              onClick={onBack}
              type="button"
              className="w-full bg-white text-purple-600 px-6 py-3 rounded-xl text-base font-semibold hover:bg-purple-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-purple-300"
              disabled={isProcessing}
            >
              Back
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
}