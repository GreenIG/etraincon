"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Mail, Phone, MapPin, Building, Calendar, Camera, Save, Edit, Loader2, UserPlus, Upload, X } from "lucide-react"

interface UserData {
  id: number
  username: string
  email: string
}

interface ProfileData {
  name?: string
  title?: string
  company?: string
  location?: string
  experience?: string
  phone?: string
  linkedin_url?: string
  professional_bio?: string
  areas_of_interest?: string
  profile_image?: string
  updated_at?: string
}

interface ApiResponse {
  ok: boolean
  user: UserData
  has_profile: boolean
  profile: ProfileData | null
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userData, setUserData] = useState<UserData | null>(null)
  const [profileData, setProfileData] = useState<ProfileData>({})
  const [hasProfile, setHasProfile] = useState(false)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [showImageUpload, setShowImageUpload] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Fetch user and profile data from API
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch('https://etraincon.com/api/profile_get.php', {
          credentials: 'include', // Include session cookies
          headers: {
            'Content-Type': 'application/json',
          },
        })
        
        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Please log in to access your profile.')
          }
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const data: ApiResponse = await response.json()
        
        if (!data.ok) {
          throw new Error('Failed to fetch profile data')
        }
        
        setUserData(data.user)
        setHasProfile(data.has_profile)
        
        if (data.has_profile && data.profile) {
          setProfileData(data.profile)
          // Try to get image from backend first, then localStorage as fallback
          const backendImage = data.profile.profile_image
          const localImage = localStorage.getItem('profile_image')
          setProfileImage(backendImage || localImage || null)
          console.log('Image loaded:', backendImage ? 'from backend' : localImage ? 'from localStorage' : 'no image')
        } else {
          // Initialize empty profile data
          setProfileData({
            name: '',
            title: '',
            company: '',
            location: '',
            experience: '',
            phone: '',
            linkedin_url: '',
            professional_bio: '',
            areas_of_interest: '',
            profile_image: '', // Initialize profile_image
          })
          // Try to load image from localStorage
          const localImage = localStorage.getItem('profile_image')
          setProfileImage(localImage || null)
          console.log('No profile, image loaded from localStorage:', localImage ? 'yes' : 'no')
        }
        
      } catch (err) {
        console.error('Error fetching profile data:', err)
        setError(err instanceof Error ? err.message : 'Failed to load profile data.')
      } finally {
        setLoading(false)
      }
    }

    fetchProfileData()
  }, [])

  const handleSave = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Prepare profile data for API
      const saveData = {
        name: profileData.name || '',
        title: profileData.title || '',
        company: profileData.company || '',
        location: profileData.location || '',
        experience: profileData.experience || '',
        phone: profileData.phone || '',
        linkedin_url: profileData.linkedin_url || '',
        professional_bio: profileData.professional_bio || '',
        areas_of_interest: profileData.areas_of_interest || '',
        profile_image: profileImage || '', // Include profile_image in save data
      }
      
      console.log('Saving profile data:', {
        ...saveData,
        profile_image: saveData.profile_image ? 'Image data present (length: ' + saveData.profile_image.length + ')' : 'No image data'
      })
      
      const response = await fetch('https://etraincon.com/api/profile_save.php', {
        method: 'POST',
        credentials: 'include', // Include session cookies
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(saveData)
      })
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Session expired. Please log in again.')
        }
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data: ApiResponse = await response.json()
      console.log('Backend response:', data)
      
      if (!data.ok) {
        throw new Error('Failed to save profile')
      }
      
      // Store image in localStorage as fallback if backend doesn't support it
      if (profileImage) {
        localStorage.setItem('profile_image', profileImage)
        console.log('Image stored in localStorage as fallback')
      }
      
      // Update state with returned data
      setUserData(data.user)
      setHasProfile(data.has_profile)
      if (data.profile) {
        setProfileData(data.profile)
        setProfileImage(data.profile.profile_image || null) // Update profileImage from response
      }
      
      setIsEditing(false)
      setError('✅ Profile saved successfully')
      setTimeout(() => setError(null), 3000)
      
    } catch (err) {
      console.error('Error saving profile:', err)
      setError(err instanceof Error ? err.message : 'Failed to save profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Image upload triggered', event.target.files)
    const file = event.target.files?.[0]
    if (file) {
      console.log('File selected:', file.name, file.type, file.size)
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file.')
        return
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB.')
        return
      }
      
      const reader = new FileReader()
      reader.onload = (e) => {
        console.log('File read successfully')
        const imageData = e.target?.result as string
        setProfileImage(imageData)
        // Also update profileData to include the image
        setProfileData(prev => ({
          ...prev,
          profile_image: imageData
        }))
        setShowImageUpload(false)
        setError('✅ Image uploaded successfully!')
        setTimeout(() => setError(null), 3000)
      }
      reader.onerror = () => {
        console.error('Error reading file')
        setError('Error reading image file. Please try again.')
      }
      reader.readAsDataURL(file)
    } else {
      console.log('No file selected')
    }
  }

  const handleTakePhoto = () => {
    console.log('Take photo triggered')
    if (fileInputRef.current) {
      fileInputRef.current.accept = 'image/*'
      fileInputRef.current.capture = 'environment'
      fileInputRef.current.click()
    }
  }

  const handleUploadPhoto = () => {
    console.log('Upload photo triggered')
    if (fileInputRef.current) {
      fileInputRef.current.accept = 'image/*'
      // Remove capture attribute for gallery access
      fileInputRef.current.removeAttribute('capture')
      fileInputRef.current.click()
    }
  }

  const handleRemoveImage = () => {
    console.log('Remove image triggered')
    setProfileImage(null)
    // Also clear the profile_image from profileData
    setProfileData(prev => ({
      ...prev,
      profile_image: ''
    }))
    // Clear from localStorage
    localStorage.removeItem('profile_image')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Get initials for avatar
  const getInitials = (name: string) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  if (loading) {
    return (
      <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-center min-h-[300px] sm:min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-600 text-sm sm:text-base">Loading profile data...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-center min-h-[300px] sm:min-h-[400px]">
          <div className="text-center">
            <p className="text-gray-600 text-sm sm:text-base">No user data available.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Profile</h1>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          {!hasProfile && (
            <div className="flex items-center space-x-2 text-blue-600 bg-blue-50 px-3 py-1 rounded-full text-xs sm:text-sm">
              <UserPlus className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Create Profile</span>
            </div>
          )}
          <Button
            onClick={isEditing ? handleSave : () => setIsEditing(true)}
            className={`w-full sm:w-auto ${
              isEditing ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"
            }`}
            disabled={loading}
          >
            {isEditing ? (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            ) : (
              <>
                <Edit className="w-4 h-4 mr-2" />
                {hasProfile ? 'Edit Profile' : 'Create Profile'}
              </>
            )}
          </Button>
        </div>
      </div>

      {error && (
        <div className={`border rounded-lg p-3 sm:p-4 text-sm sm:text-base ${
          error.includes('✅') 
            ? 'bg-green-50 border-green-200 text-green-800' 
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          <p>{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardContent className="p-4 sm:p-6">
            <div className="text-center">
              <div className="relative inline-block mb-4 sm:mb-6">
                <Avatar className="w-20 h-20 sm:w-24 sm:h-24">
                  <AvatarImage 
                    src={profileImage || profileData.profile_image || "/placeholder.svg?height=96&width=96&text=JE"} 
                    alt="Profile" 
                  />
                  <AvatarFallback className="text-base sm:text-lg font-semibold">
                    {getInitials(profileData.name || userData.username)}
                  </AvatarFallback>
                </Avatar>
                
                {isEditing && (
                  <div className="absolute -bottom-2 -right-2 flex space-x-1">
                    <Button
                      size="sm"
                      className="h-6 w-6 sm:h-8 sm:w-8 rounded-full p-0 bg-blue-600 hover:bg-blue-700"
                      variant="default"
                      onClick={() => setShowImageUpload(!showImageUpload)}
                    >
                      <Camera className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                    {profileImage && (
                      <Button
                        size="sm"
                        className="h-6 w-6 sm:h-8 sm:w-8 rounded-full p-0 bg-red-600 hover:bg-red-700"
                        variant="default"
                        onClick={handleRemoveImage}
                      >
                        <X className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                    )}
                  </div>
                )}
              </div>

              {/* Image Upload Options */}
              {isEditing && showImageUpload && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={handleUploadPhoto}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Photo
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={handleTakePhoto}
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      Take Photo
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Supported formats: JPG, PNG, GIF (max 5MB)
                  </p>
                </div>
              )}

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="profile-image-input"
              />

              {isEditing ? (
                <div className="space-y-3">
                  <Input
                    value={profileData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="text-center font-semibold text-sm sm:text-base"
                    placeholder="Full Name"
                  />
                  <Input
                    value={profileData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className="text-center text-xs sm:text-sm"
                    placeholder="Job Title"
                  />
                </div>
              ) : (
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                    {profileData.name || userData.username}
                  </h2>
                  <p className="text-gray-600 text-sm sm:text-base">{profileData.title || 'No title set'}</p>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">{profileData.company || 'No company set'}</p>
                  <p className="text-xs text-gray-400 mt-1">@{userData.username}</p>
                </div>
              )}

              <div className="mt-4 sm:mt-6 space-y-2">
                <div className="flex items-center justify-center text-xs sm:text-sm text-gray-600">
                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  {isEditing ? (
                    <Input
                      value={profileData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      className="text-center text-xs sm:text-sm h-6 sm:h-8"
                      placeholder="Location"
                    />
                  ) : (
                    <span className="truncate max-w-[150px] sm:max-w-none">{profileData.location || 'No location set'}</span>
                  )}
                </div>

                <div className="flex items-center justify-center text-xs sm:text-sm text-gray-600">
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  {isEditing ? (
                    <Input
                      value={profileData.experience}
                      onChange={(e) => handleInputChange("experience", e.target.value)}
                      className="text-center text-xs sm:text-sm h-6 sm:h-8"
                      placeholder="Experience"
                    />
                  ) : (
                    <span className="truncate max-w-[150px] sm:max-w-none">
                      {profileData.experience ? `${profileData.experience} experience` : 'No experience set'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Details */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Contact Information */}
          <Card>
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-lg sm:text-xl">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm sm:text-base">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={userData.email}
                      disabled={true}
                      className="pl-10 bg-gray-50 text-sm sm:text-base"
                      placeholder="email@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm sm:text-base">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      disabled={!isEditing}
                      className="pl-10 text-sm sm:text-base"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="company" className="text-sm sm:text-base">Company</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="company"
                    value={profileData.company}
                    onChange={(e) => handleInputChange("company", e.target.value)}
                    disabled={!isEditing}
                    className="pl-10 text-sm sm:text-base"
                    placeholder="Company Name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedin" className="text-sm sm:text-base">LinkedIn Profile</Label>
                <Input
                  id="linkedin"
                  value={profileData.linkedin_url}
                  onChange={(e) => handleInputChange("linkedin_url", e.target.value)}
                  disabled={!isEditing}
                  className="text-sm sm:text-base"
                  placeholder="linkedin.com/in/yourname"
                />
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card>
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-lg sm:text-xl">Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bio" className="text-sm sm:text-base">Professional Bio</Label>
                <Textarea
                  id="bio"
                  value={profileData.professional_bio}
                  onChange={(e) => handleInputChange("professional_bio", e.target.value)}
                  disabled={!isEditing}
                  rows={3}
                  className="resize-none text-sm sm:text-base"
                  placeholder="Tell us about your professional background and expertise..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="interests" className="text-sm sm:text-base">Areas of Interest</Label>
                <Textarea
                  id="interests"
                  value={profileData.areas_of_interest}
                  onChange={(e) => handleInputChange("areas_of_interest", e.target.value)}
                  disabled={!isEditing}
                  rows={2}
                  className="resize-none text-sm sm:text-base"
                  placeholder="e.g., Infrastructure Design, Sustainable Construction, Safety Protocols"
                />
              </div>
            </CardContent>
          </Card>

          {/* Profile Status */}
          {hasProfile && profileData.updated_at && (
            <Card>
              <CardContent className="p-3 sm:p-4">
                <p className="text-xs sm:text-sm text-gray-500">
                  Last updated: {new Date(profileData.updated_at).toLocaleString()}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
