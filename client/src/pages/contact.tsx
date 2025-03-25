import { useState } from "react";
import { Helmet } from 'react-helmet';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { ContactFormData } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

// Form schema with validation
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters")
});

export default function ContactPage() {
  const { toast } = useToast();
  const [formSubmitted, setFormSubmitted] = useState(false);

  const form = useForm<ContactFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: ""
    }
  });

  const mutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      const response = await apiRequest("POST", "/api/contact", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Message Sent",
        description: "Thank you for your message. We'll get back to you soon.",
      });
      form.reset();
      setFormSubmitted(true);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to send message: ${error}`,
        variant: "destructive",
      });
    }
  });

  const onSubmit = (data: ContactFormData) => {
    mutation.mutate(data);
  };

  return (
    <>
      <Helmet>
        <title>Contact Us | Total Enclosures</title>
        <meta name="description" content="Contact Total Enclosures for any inquiries about our industrial enclosure solutions, custom cabinets, or services." />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Open+Sans:wght@400;600&display=swap" rel="stylesheet" />
      </Helmet>
      
      <div className="flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-grow pt-32">
          {/* Page Header */}
          <section className="bg-[#002357] py-16 text-white">
            <div className="container mx-auto px-4">
              <h1 className="text-4xl font-bold mb-4 font-poppins">Contact Us</h1>
              <p className="text-xl max-w-3xl">
                Get in touch with our team for inquiries, quotes, or support.
              </p>
            </div>
          </section>
          
          {/* Contact Information & Form */}
          <section className="py-16">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Contact Information */}
                <div className="lg:col-span-1">
                  <h2 className="text-2xl font-bold text-[#002357] mb-6 font-poppins">Contact Information</h2>
                  
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="bg-[#f47920] text-white p-3 rounded-full mr-4">
                        <i className="fas fa-map-marker-alt"></i>
                      </div>
                      <div>
                        <h3 className="font-bold text-[#002357] mb-1 font-poppins">Our Location</h3>
                        <p className="text-gray-600">
                          123 Industrial Way<br />
                          Derbyshire, DE12 3AB<br />
                          United Kingdom
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-[#f47920] text-white p-3 rounded-full mr-4">
                        <i className="fas fa-phone-alt"></i>
                      </div>
                      <div>
                        <h3 className="font-bold text-[#002357] mb-1 font-poppins">Phone</h3>
                        <p className="text-gray-600">
                          <a href="tel:+441283499380" className="hover:text-[#f47920]">
                            +44 (0) 1283 499380
                          </a>
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-[#f47920] text-white p-3 rounded-full mr-4">
                        <i className="fas fa-envelope"></i>
                      </div>
                      <div>
                        <h3 className="font-bold text-[#002357] mb-1 font-poppins">Email</h3>
                        <p className="text-gray-600">
                          <a href="mailto:info@totalenc.com" className="hover:text-[#f47920]">
                            info@totalenc.com
                          </a>
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-[#f47920] text-white p-3 rounded-full mr-4">
                        <i className="fas fa-clock"></i>
                      </div>
                      <div>
                        <h3 className="font-bold text-[#002357] mb-1 font-poppins">Business Hours</h3>
                        <p className="text-gray-600">
                          Monday - Friday: 9:00 AM - 5:30 PM<br />
                          Saturday & Sunday: Closed
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <h3 className="font-bold text-[#002357] mb-3 font-poppins">Connect With Us</h3>
                    <div className="flex space-x-4">
                      <a href="#" className="bg-[#002357] text-white p-3 rounded-full hover:bg-[#f47920] transition-colors">
                        <i className="fab fa-facebook-f"></i>
                      </a>
                      <a href="#" className="bg-[#002357] text-white p-3 rounded-full hover:bg-[#f47920] transition-colors">
                        <i className="fab fa-twitter"></i>
                      </a>
                      <a href="#" className="bg-[#002357] text-white p-3 rounded-full hover:bg-[#f47920] transition-colors">
                        <i className="fab fa-linkedin-in"></i>
                      </a>
                    </div>
                  </div>
                </div>
                
                {/* Contact Form */}
                <div className="lg:col-span-2 bg-white p-8 rounded-lg shadow-md">
                  {formSubmitted ? (
                    <div className="text-center py-8">
                      <div className="text-green-500 mb-4">
                        <i className="fas fa-check-circle text-5xl"></i>
                      </div>
                      <h2 className="text-2xl font-bold text-[#002357] mb-4 font-poppins">Thank You!</h2>
                      <p className="text-gray-600 mb-6">
                        Your message has been sent successfully. We'll get back to you shortly.
                      </p>
                      <button
                        onClick={() => setFormSubmitted(false)}
                        className="bg-[#002357] text-white px-6 py-3 rounded-md hover:bg-[#003a8c] transition-colors"
                      >
                        Send Another Message
                      </button>
                    </div>
                  ) : (
                    <>
                      <h2 className="text-2xl font-bold text-[#002357] mb-6 font-poppins">Send Us a Message</h2>
                      
                      <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                              Your Name <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              id="name"
                              {...form.register("name")}
                              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#f47920]"
                            />
                            {form.formState.errors.name && (
                              <p className="text-red-500 text-sm mt-1">{form.formState.errors.name.message}</p>
                            )}
                          </div>
                          
                          <div>
                            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                              Email Address <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="email"
                              id="email"
                              {...form.register("email")}
                              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#f47920]"
                            />
                            {form.formState.errors.email && (
                              <p className="text-red-500 text-sm mt-1">{form.formState.errors.email.message}</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            id="phone"
                            {...form.register("phone")}
                            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#f47920]"
                          />
                        </div>
                        
                        <div className="mb-4">
                          <label htmlFor="message" className="block text-gray-700 font-medium mb-2">
                            Your Message <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            id="message"
                            rows={6}
                            {...form.register("message")}
                            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#f47920]"
                          ></textarea>
                          {form.formState.errors.message && (
                            <p className="text-red-500 text-sm mt-1">{form.formState.errors.message.message}</p>
                          )}
                        </div>
                        
                        <div className="text-right">
                          <button
                            type="submit"
                            disabled={mutation.isPending}
                            className="bg-[#f47920] text-white px-6 py-3 rounded-md hover:bg-[#ff8f3e] transition-colors disabled:opacity-50"
                          >
                            {mutation.isPending ? (
                              <span><i className="fas fa-spinner fa-spin mr-2"></i> Sending...</span>
                            ) : (
                              <span>Send Message</span>
                            )}
                          </button>
                        </div>
                      </form>
                    </>
                  )}
                </div>
              </div>
            </div>
          </section>
          
          {/* Map Section */}
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-[#002357] mb-4 font-poppins">Our Location</h2>
                <p className="max-w-3xl mx-auto text-gray-600">
                  Visit our facility or reach out to us for directions.
                </p>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-md">
                <div className="h-96 bg-gray-300 rounded overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
                    <p>Map would be displayed here</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
        
        <Footer />
      </div>
    </>
  );
}
