-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Create Students Table
create table if not exists students (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  "regNo" text unique not null,
  dob text not null,
  "busRouteNo" text not null,
  "stoppingName" text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create Buses Table
create table if not exists buses (
  id uuid default uuid_generate_v4() primary key,
  "routeNo" text unique not null,
  "routeName" text not null,
  "driverName" text not null,
  "totalStudents" integer default 0,
  status text check (status in ('On Time', 'Delayed', 'Breakdown')) default 'On Time',
  "currentLocation" jsonb not null default '{"lat": 0, "lng": 0}'::jsonb,
  "delayMin" integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Create Notifications Table
create table if not exists notifications (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  message text not null,
  time text not null,
  type text check (type in ('delay', 'info', 'alert')) default 'info',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Create Complaints Table
create table if not exists complaints (
  id uuid default uuid_generate_v4() primary key,
  "studentName" text not null,
  category text not null,
  "desc" text not null,
  time text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table students enable row level security;
alter table buses enable row level security;
alter table notifications enable row level security;
alter table complaints enable row level security;

-- Create Policies (Public Read/Write for Demo purposes - adjust for production)
create policy "Public read access for students" on students for select using (true);
create policy "Public read access for buses" on buses for select using (true);
create policy "Public read access for notifications" on notifications for select using (true);
create policy "Public insert access for complaints" on complaints for insert with check (true);
create policy "Public read access for complaints" on complaints for select using (true);

-- Insert Mock Data: Students
insert into students (name, "regNo", dob, "busRouteNo", "stoppingName") values
  ('Immanuvel H', '732423243010', '06/08/2006', '121', 'NRK Puram, Tiruppur'),
  ('Raghavi', '732423243008', '28/07/2005', '113', 'Koduvai'),
  ('Akilendeshwari', '732423243002', '23/02/2005', '118', 'Erode'),
  ('Arshiya Sana', '732423243003', '06/04/2005', '111', 'Tiruppur New Bus Stand'),
  ('Rithik Roshan', '732423243021', '23/01/2005', '121', 'Uthukuli, Tiruppur'),
  ('Tamil Arasi', '732423243024', '28/10/2006', '114', '15, Velampalayam'),
  ('Darshan Kumar', '732423243004', '17/03/2005', '122', 'Bhavani'),
  ('Kavin', '732423243013', '08/08/2005', '125', 'Old Bus Stand, Tiruppur'),
  ('Lathika', '732423243015', '26/02/2006', '110', 'Perumanallur'),
  ('Gayathri', '732423243005', '12/11/2006', '121', 'Kodikkambam, Tiruppur')
on conflict ("regNo") do nothing;

-- Insert Mock Data: Buses
insert into buses ("routeNo", "routeName", "driverName", "totalStudents", status, "currentLocation", "delayMin") values
  ('121', 'Tiruppur Route', 'Ramesh', 42, 'Delayed', '{"lat": 11.1085, "lng": 77.3411}', 15),
  ('113', 'Koduvai Route', 'Suresh', 35, 'On Time', '{"lat": 10.9876, "lng": 77.4532}', 0),
  ('118', 'Erode Route', 'Mani', 50, 'On Time', '{"lat": 11.3410, "lng": 77.7172}', 0),
  ('111', 'New Bus Stand', 'Velu', 38, 'Breakdown', '{"lat": 11.1234, "lng": 77.3333}', 0),
  ('122', 'Bhavani Route', 'Kumar', 45, 'On Time', '{"lat": 11.4444, "lng": 77.6888}', 0)
on conflict ("routeNo") do nothing;

-- Insert Mock Data: Notifications
insert into notifications (title, message, time, type) values
  ('Bus 121 Delayed', 'Heavy traffic at Tiruppur Main signal.', '08:15 AM', 'delay'),
  ('Route Change', 'Bus 118 will skip stop #4 due to construction.', 'Yesterday', 'info');
