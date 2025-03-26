import { useState } from "react";
import AdminLayout from "@/components/admin/admin-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function AdminSettings() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("general");
  
  // Mock data for settings
  const [generalSettings, setGeneralSettings] = useState({
    siteName: "Totalenc",
    siteDescription: "Premium enclosure solutions for all industries.",
    siteUrl: "https://totalenc.com",
    email: "info@totalenc.com",
    phone: "+1 (555) 123-4567",
    address: "123 Industrial Lane, Manufacturing City, IN 45678"
  });
  
  const [seoSettings, setSeoSettings] = useState({
    metaTitle: "Total Enclosures | Premium Industrial Enclosure Solutions",
    metaDescription: "Total Enclosures provides high-quality enclosure solutions for industrial, electronic, and commercial applications with custom designs and services.",
    googleAnalyticsId: "UA-12345678-9",
    robotsTxt: "User-agent: *\nAllow: /",
    sitemapEnabled: true
  });
  
  const [socialSettings, setSocialSettings] = useState({
    facebookUrl: "https://facebook.com/totalenclosures",
    twitterUrl: "https://twitter.com/totalenclosures",
    linkedinUrl: "https://linkedin.com/company/totalenclosures",
    youtubeUrl: "https://youtube.com/totalenclosures",
    instagramUrl: ""
  });
  
  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your settings have been saved successfully.",
    });
  };

  return (
    <AdminLayout title="Settings">
      <div className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-5 w-full">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
            <TabsTrigger value="social">Social Media</TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>
          
          {/* General Settings */}
          <TabsContent value="general" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>Manage your website's basic information</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="siteName" className="block text-sm font-medium mb-1">Site Name</label>
                      <Input 
                        id="siteName" 
                        value={generalSettings.siteName} 
                        onChange={(e) => setGeneralSettings({...generalSettings, siteName: e.target.value})} 
                      />
                    </div>
                    <div>
                      <label htmlFor="siteUrl" className="block text-sm font-medium mb-1">Site URL</label>
                      <Input 
                        id="siteUrl" 
                        value={generalSettings.siteUrl} 
                        onChange={(e) => setGeneralSettings({...generalSettings, siteUrl: e.target.value})} 
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="siteDescription" className="block text-sm font-medium mb-1">Site Description</label>
                    <Textarea 
                      id="siteDescription" 
                      value={generalSettings.siteDescription} 
                      onChange={(e) => setGeneralSettings({...generalSettings, siteDescription: e.target.value})} 
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-1">Email Address</label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={generalSettings.email} 
                        onChange={(e) => setGeneralSettings({...generalSettings, email: e.target.value})} 
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium mb-1">Phone Number</label>
                      <Input 
                        id="phone" 
                        value={generalSettings.phone} 
                        onChange={(e) => setGeneralSettings({...generalSettings, phone: e.target.value})} 
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium mb-1">Business Address</label>
                    <Textarea 
                      id="address" 
                      value={generalSettings.address} 
                      onChange={(e) => setGeneralSettings({...generalSettings, address: e.target.value})} 
                      rows={2}
                    />
                  </div>
                  
                  <div className="pt-4">
                    <Button onClick={handleSave}>
                      Save Changes
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* SEO Settings */}
          <TabsContent value="seo" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>SEO Settings</CardTitle>
                <CardDescription>Optimize your website for search engines</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div>
                    <label htmlFor="metaTitle" className="block text-sm font-medium mb-1">Default Meta Title</label>
                    <Input 
                      id="metaTitle" 
                      value={seoSettings.metaTitle} 
                      onChange={(e) => setSeoSettings({...seoSettings, metaTitle: e.target.value})} 
                    />
                    <p className="text-xs text-gray-500 mt-1">Recommended length: 50-60 characters</p>
                  </div>
                  
                  <div>
                    <label htmlFor="metaDescription" className="block text-sm font-medium mb-1">Default Meta Description</label>
                    <Textarea 
                      id="metaDescription" 
                      value={seoSettings.metaDescription} 
                      onChange={(e) => setSeoSettings({...seoSettings, metaDescription: e.target.value})} 
                      rows={3}
                    />
                    <p className="text-xs text-gray-500 mt-1">Recommended length: 150-160 characters</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="googleAnalyticsId" className="block text-sm font-medium mb-1">Google Analytics ID</label>
                      <Input 
                        id="googleAnalyticsId" 
                        value={seoSettings.googleAnalyticsId} 
                        onChange={(e) => setSeoSettings({...seoSettings, googleAnalyticsId: e.target.value})} 
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2 mt-8">
                      <Switch 
                        id="sitemapEnabled" 
                        checked={seoSettings.sitemapEnabled}
                        onCheckedChange={(checked) => setSeoSettings({...seoSettings, sitemapEnabled: checked})}
                      />
                      <label htmlFor="sitemapEnabled" className="text-sm font-medium">
                        Enable XML Sitemap
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="robotsTxt" className="block text-sm font-medium mb-1">Robots.txt Content</label>
                    <Textarea 
                      id="robotsTxt" 
                      value={seoSettings.robotsTxt} 
                      onChange={(e) => setSeoSettings({...seoSettings, robotsTxt: e.target.value})} 
                      rows={5}
                      className="font-mono text-sm"
                    />
                  </div>
                  
                  <div className="pt-4">
                    <Button onClick={handleSave}>
                      Save Changes
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Social Media Settings */}
          <TabsContent value="social" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Social Media Settings</CardTitle>
                <CardDescription>Configure your social media links</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="facebookUrl" className="block text-sm font-medium mb-1">Facebook URL</label>
                      <Input 
                        id="facebookUrl" 
                        value={socialSettings.facebookUrl} 
                        onChange={(e) => setSocialSettings({...socialSettings, facebookUrl: e.target.value})} 
                      />
                    </div>
                    <div>
                      <label htmlFor="twitterUrl" className="block text-sm font-medium mb-1">Twitter URL</label>
                      <Input 
                        id="twitterUrl" 
                        value={socialSettings.twitterUrl} 
                        onChange={(e) => setSocialSettings({...socialSettings, twitterUrl: e.target.value})} 
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="linkedinUrl" className="block text-sm font-medium mb-1">LinkedIn URL</label>
                      <Input 
                        id="linkedinUrl" 
                        value={socialSettings.linkedinUrl} 
                        onChange={(e) => setSocialSettings({...socialSettings, linkedinUrl: e.target.value})} 
                      />
                    </div>
                    <div>
                      <label htmlFor="youtubeUrl" className="block text-sm font-medium mb-1">YouTube URL</label>
                      <Input 
                        id="youtubeUrl" 
                        value={socialSettings.youtubeUrl} 
                        onChange={(e) => setSocialSettings({...socialSettings, youtubeUrl: e.target.value})} 
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="instagramUrl" className="block text-sm font-medium mb-1">Instagram URL</label>
                    <Input 
                      id="instagramUrl" 
                      value={socialSettings.instagramUrl} 
                      onChange={(e) => setSocialSettings({...socialSettings, instagramUrl: e.target.value})} 
                    />
                  </div>
                  
                  <div className="pt-4">
                    <Button onClick={handleSave}>
                      Save Changes
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Comments Settings */}
          <TabsContent value="comments" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Comment Settings</CardTitle>
                <CardDescription>Manage how comments are handled on your site</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Enable Comments</h3>
                        <p className="text-sm text-gray-500">Allow users to comment on blog posts</p>
                      </div>
                      <Switch defaultChecked id="comments-enabled" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Comment Moderation</h3>
                        <p className="text-sm text-gray-500">Require approval before comments are published</p>
                      </div>
                      <Switch defaultChecked id="comment-moderation" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Close Comments</h3>
                        <p className="text-sm text-gray-500">Automatically close comments on posts older than:</p>
                      </div>
                      <Select defaultValue="30">
                        <SelectTrigger className="w-[200px]">
                          <SelectValue placeholder="Select days" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="never">Never close comments</SelectItem>
                          <SelectItem value="14">After 14 days</SelectItem>
                          <SelectItem value="30">After 30 days</SelectItem>
                          <SelectItem value="60">After 60 days</SelectItem>
                          <SelectItem value="90">After 90 days</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label htmlFor="blacklist" className="block text-sm font-medium mb-1">Comment Blacklist</label>
                      <Textarea 
                        id="blacklist" 
                        placeholder="Enter words or phrases to block, one per line"
                        rows={4}
                      />
                      <p className="text-xs text-gray-500 mt-1">Comments containing these words will be held for moderation</p>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Button onClick={handleSave}>
                      Save Changes
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Advanced Settings */}
          <TabsContent value="advanced" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Settings</CardTitle>
                <CardDescription>Configure technical aspects of your website</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="space-y-4">
                    <h3 className="font-medium">Cache Settings</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium">Enable Page Caching</h4>
                        <p className="text-xs text-gray-500">Improve performance by caching page output</p>
                      </div>
                      <Switch defaultChecked id="page-cache" />
                    </div>
                    
                    <div>
                      <label htmlFor="cache-lifetime" className="block text-sm font-medium mb-1">Cache Lifetime</label>
                      <Select defaultValue="3600">
                        <SelectTrigger>
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1800">30 minutes</SelectItem>
                          <SelectItem value="3600">1 hour</SelectItem>
                          <SelectItem value="10800">3 hours</SelectItem>
                          <SelectItem value="21600">6 hours</SelectItem>
                          <SelectItem value="86400">1 day</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="border-t pt-4 mt-4">
                      <h3 className="font-medium mb-2">Database Maintenance</h3>
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full justify-start">
                          <i className="fas fa-database mr-2"></i> Optimize Database
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <i className="fas fa-trash mr-2"></i> Clear Cache
                        </Button>
                      </div>
                    </div>
                    
                    <div className="border-t pt-4 mt-4">
                      <h3 className="font-medium mb-2">Security Settings</h3>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium">Force HTTPS</h4>
                          <p className="text-xs text-gray-500">Redirect all HTTP requests to HTTPS</p>
                        </div>
                        <Switch defaultChecked id="force-https" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Button onClick={handleSave}>
                      Save Changes
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}