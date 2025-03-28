import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import About from "@/pages/about";
import ContactPage from "@/pages/contact";
import BlogIndex from "@/pages/blog/index";
import BlogDetail from "@/pages/blog/[id]";
import ProductsPage from "@/pages/products/index";
import ServicesPage from "@/pages/services";
import ServiceDetail from "@/pages/services/[slug]";
import CaseStudiesPage from "@/pages/case-studies";
import AdminDashboard from "@/pages/admin/index";
import AdminLogin from "@/pages/admin/login";
import AdminBlogs from "@/pages/admin/blogs/index";
import AdminNewBlog from "@/pages/admin/blogs/new";
import AdminEditBlog from "@/pages/admin/blogs/[id]";
import AdminCategories from "@/pages/admin/categories/index";
import AdminUsers from "@/pages/admin/users/index";
import AdminMedia from "@/pages/admin/media/index";
import AdminSettings from "@/pages/admin/settings/index";
import AdminComments from "@/pages/admin/comments/index";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/blog" component={BlogIndex} />
      <Route path="/blog/:id" component={BlogDetail} />
      <Route path="/products" component={ProductsPage} />
      <Route path="/services" component={ServicesPage} />
      <Route path="/services/:slug" component={ServiceDetail} />
      <Route path="/case-studies" component={CaseStudiesPage} />

      {/* Admin Routes */}
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/blogs" component={AdminBlogs} />
      <Route path="/admin/blogs/new" component={AdminNewBlog} />
      <Route path="/admin/blogs/:id" component={AdminEditBlog} />
      <Route path="/admin/categories" component={AdminCategories} />
      <Route path="/admin/users" component={AdminUsers} />
      <Route path="/admin/media" component={AdminMedia} />
      <Route path="/admin/settings" component={AdminSettings} />
      <Route path="/admin/comments" component={AdminComments} />
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
