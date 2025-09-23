import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Import components and pages
import BookingForm from '../../components/calendar/BookingForm';
import BookingList from '../../components/calendar/BookingList';
import ScheduleForm from '../../components/calendar/ScheduleForm';
import ScheduleList from '../../components/calendar/ScheduleList';
import ResourceForm from '../../components/calendar/ResourceForm';
import ResourceList from '../../components/calendar/ResourceList';
import EventForm from '../../components/calendar/EventForm';
import EventList from '../../components/calendar/EventList';

import BookingsPage from '../../app/protected/calendar/bookings/page';
import SchedulesPage from '../../app/protected/calendar/schedules/page';
import ResourcesPage from '../../app/protected/calendar/resources/page';
import EventsPage from '../../app/protected/calendar/events/page';

describe('Calendar & Scheduling Components and Pages', () => {
  // BookingForm
  test('BookingForm renders correctly', () => {
    const handleSubmit = jest.fn();
    render(<BookingForm onSubmit={handleSubmit} />);
    expect(screen.getByLabelText(/Resource ID:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Resource Type:/i)).toBeInTheDocument();
  });

  // BookingList
  test('BookingList renders correctly', () => {
    render(<BookingList />);
    expect(screen.getByText(/Loading bookings.../i)).toBeInTheDocument();
  });

  // ScheduleForm
  test('ScheduleForm renders correctly', () => {
    const handleSubmit = jest.fn();
    render(<ScheduleForm onSubmit={handleSubmit} />);
    expect(screen.getByLabelText(/Employee ID:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Shift Date:/i)).toBeInTheDocument();
  });

  // ScheduleList
  test('ScheduleList renders correctly', () => {
    render(<ScheduleList />);
    expect(screen.getByText(/Loading schedules.../i)).toBeInTheDocument();
  });

  // ResourceForm
  test('ResourceForm renders correctly', () => {
    const handleSubmit = jest.fn();
    render(<ResourceForm onSubmit={handleSubmit} />);
    expect(screen.getByLabelText(/Name:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Resource Type:/i)).toBeInTheDocument();
  });

  // ResourceList
  test('ResourceList renders correctly', () => {
    render(<ResourceList />);
    expect(screen.getByText(/Loading resources.../i)).toBeInTheDocument();
  });

  // EventForm
  test('EventForm renders correctly', () => {
    const handleSubmit = jest.fn();
    render(<EventForm onSubmit={handleSubmit} />);
    expect(screen.getByLabelText(/Title:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Start Time:/i)).toBeInTheDocument();
  });

  // EventList
  test('EventList renders correctly', () => {
    render(<EventList />);
    expect(screen.getByText(/Loading events.../i)).toBeInTheDocument();
  });

  // Pages
  test('BookingsPage renders correctly', () => {
    render(<BookingsPage />);
    expect(screen.getByRole('heading', { name: /Booking Management/i })).toBeInTheDocument();
  });

  test('SchedulesPage renders correctly', () => {
    render(<SchedulesPage />);
    expect(screen.getByRole('heading', { name: /Schedule Management/i })).toBeInTheDocument();
  });

  test('ResourcesPage renders correctly', () => {
    render(<ResourcesPage />);
    expect(screen.getByRole('heading', { name: /Resource Management/i })).toBeInTheDocument();
  });

  test('EventsPage renders correctly', () => {
    render(<EventsPage />);
    expect(screen.getByRole('heading', { name: /Event Management/i })).toBeInTheDocument();
  });
});
