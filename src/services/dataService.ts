import { supabase } from '../lib/supabase';
import { STUDENTS_DB, BUS_FLEET, MOCK_NOTIFICATIONS } from '../constants';
import { Student, BusInfo, Notification } from '../types';

export const dataService = {
  async getStudent(regNo: string): Promise<Student | null> {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('regNo', regNo)
        .single();

      if (error || !data) {
        console.warn('Supabase fetch failed or empty, falling back to mock data:', error);
        return STUDENTS_DB.find(s => s.regNo === regNo) || null;
      }

      return data as Student;
    } catch (err) {
      console.error('Supabase error:', err);
      return STUDENTS_DB.find(s => s.regNo === regNo) || null;
    }
  },

  async getBus(routeNo: string): Promise<BusInfo | null> {
    try {
      const { data, error } = await supabase
        .from('buses')
        .select('*')
        .eq('routeNo', routeNo)
        .single();

      if (error || !data) {
        return BUS_FLEET.find(b => b.routeNo === routeNo) || null;
      }
      return data as BusInfo;
    } catch (err) {
      return BUS_FLEET.find(b => b.routeNo === routeNo) || null;
    }
  },

  async getAllBuses(): Promise<BusInfo[]> {
    try {
      const { data, error } = await supabase
        .from('buses')
        .select('*');

      if (error || !data) {
        return BUS_FLEET;
      }
      return data as BusInfo[];
    } catch (err) {
      return BUS_FLEET;
    }
  },

  async getAllStudents(): Promise<Student[]> {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*');

      if (error || !data) {
        return STUDENTS_DB;
      }
      return data as Student[];
    } catch (err) {
      return STUDENTS_DB;
    }
  },

  async getNotifications(): Promise<Notification[]> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('time', { ascending: false });

      if (error || !data) {
        return MOCK_NOTIFICATIONS;
      }
      return data as Notification[];
    } catch (err) {
      return MOCK_NOTIFICATIONS;
    }
  },

  async submitComplaint(complaint: any): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('complaints')
        .insert([complaint]);

      if (error) {
        console.error('Supabase complaint submission failed:', error);
        // Fallback to local storage is handled in component if needed, or we just return false
        return false;
      }
      return true;
    } catch (err) {
      console.error('Supabase error:', err);
      return false;
    }
  }
};
