import "./App.css";
import React, { useState, useEffect } from "react";
import Protected from "./features/Protected";
import AdminRoute from "./features/AdminRoute";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  Header,
  Navigation,
  Logo,
  Login,
  Register,
  UserCRUD,
  Logout,
  Profile,
  EditUser,
  ReadUser,
  Map,
  CreateRooms,
  Admin_CRUD,
  Rooms_CRUD,
  RoomEdit,
  CreateBooking,
  CreateUser,
  BookingCRUD,
  Home,
  ReadRooms,
  UCreateBooking,
  EditBooking,
} from "./components/index";
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header>
          <Logo />
          <Navigation />
        </Header>

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* Protected Routes needs the user to be connected to the App */}
          <Route path="/" element={<Home />} />
          <Route
            path="/logout"
            element={
              <Protected>
                <Logout />
              </Protected>
            }
          />
          <Route
            path="/carte"
            element={
              <Protected>
                <Map />
              </Protected>
            }
          />
          <Route
            path="/profile"
            element={
              <Protected>
                <Profile />
              </Protected>
            }
          />
          <Route
            path="/user/:id"
            element={
              <Protected>
                <ReadUser />
              </Protected>
            }
          />

          <Route
            path="/rooms"
            element={
              <Protected>
                <ReadRooms />
              </Protected>
            }
          />

          <Route
            path="/create/bookings/:id"
            element={
              <Protected>
                <UCreateBooking />
              </Protected>
            }
          />
          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <Admin_CRUD />
              </AdminRoute>
            }
          />
          {/* User CRUD */}
          <Route
            path="/admin/edit/users"
            element={
              <AdminRoute>
                <UserCRUD />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/edit/user/:id"
            element={
              <AdminRoute>
                <EditUser />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/create/user"
            element={
              <AdminRoute>
                <CreateUser />
              </AdminRoute>
            }
          />
          {/* Room CRUD */}
          <Route
            path="/admin/edit/rooms"
            element={
              <AdminRoute>
                <Rooms_CRUD />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/edit/room/:id"
            element={
              <AdminRoute>
                <RoomEdit />
              </AdminRoute>
            }
          />
          <Route
            path="admin/create/rooms"
            element={
              <AdminRoute>
                <CreateRooms />
              </AdminRoute>
            }
          />
          {/* Booking CRUD */}
          <Route
            path="/admin/edit/bookings"
            element={
              <AdminRoute>
                <BookingCRUD />
              </AdminRoute>
            }
          />
          <Route
            path="/create/bookings"
            element={
              <AdminRoute>
                <CreateBooking />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/edit/booking/:id"
            element={
              <AdminRoute>
                <EditBooking />
              </AdminRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
