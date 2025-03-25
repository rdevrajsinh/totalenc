
import { Route, Switch } from "wouter";
import AdminPlaceholder from "./pages/admin/placeholder";
import AdminBlogs from "./pages/admin/blogs";
import AdminNewBlog from "./pages/admin/blogs/new";
import AdminDashboard from "./pages/admin/index";
import AdminLogin from "./pages/admin/login";
import NotFound from "./pages/not-found";

export default function App() {
  return (
    <Switch>
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/blogs" component={AdminBlogs} />
      <Route path="/admin/blogs/new" component={AdminNewBlog} />
      <Route path="/admin/categories" component={() => <AdminPlaceholder title="Categories" />} />
      <Route path="/admin/media" component={() => <AdminPlaceholder title="Media Library" />} />
      <Route path="/admin/comments" component={() => <AdminPlaceholder title="Comments" />} />
      <Route path="/admin/users" component={() => <AdminPlaceholder title="Users" />} />
      <Route path="/admin/settings" component={() => <AdminPlaceholder title="Settings" />} />
      <Route component={NotFound} />
    </Switch>
  );
}
