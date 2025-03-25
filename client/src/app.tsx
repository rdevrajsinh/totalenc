
import { Route } from "wouter";
import AdminPlaceholder from "./pages/admin/placeholder";

// Add these routes inside your Routes component
<Route path="/admin/categories">
  <AdminPlaceholder title="Categories" />
</Route>
<Route path="/admin/media">
  <AdminPlaceholder title="Media Library" />
</Route>
<Route path="/admin/comments">
  <AdminPlaceholder title="Comments" />
</Route>
<Route path="/admin/users">
  <AdminPlaceholder title="Users" />
</Route>
<Route path="/admin/settings">
  <AdminPlaceholder title="Settings" />
</Route>
