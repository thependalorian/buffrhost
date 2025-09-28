import { useState, useEffect } from 'react'
import { supabase, Profile, HospitalityProperty, Customer, Booking, Employee, PayrollRecord, FinancialTransaction, Commission, Invoice, Subscription, ServiceFee, CalendarEvent, Resource, Schedule } from '../lib/supabase'

// Generic Supabase hook for CRUD operations
export function useSupabaseTable<T>(
  tableName: string,
  filters?: Record<string, any>
) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      let query = supabase.from(tableName).select('*')
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          query = query.eq(key, value)
        })
      }
      
      const { data, error } = await query
      
      if (error) throw error
      setData(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const insert = async (item: Partial<T>) => {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .insert(item)
        .select()
        .single()
      
      if (error) throw error
      
      setData(prev => [...prev, data])
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Insert failed')
      throw err
    }
  }

  const update = async (id: string, updates: Partial<T>) => {
    try {
      const { data, error } = await supabase
        .from(tableName)
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      
      setData(prev => prev.map(item => 
        (item as any).id === id ? data : item
      ))
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed')
      throw err
    }
  }

  const remove = async (id: string) => {
    try {
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id)
      
      if (error) throw error
      
      setData(prev => prev.filter(item => (item as any).id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed')
      throw err
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    insert,
    update,
    remove
  }
}

// Specific hooks for different entities
export function useProfiles() {
  return useSupabaseTable<Profile>('profiles')
}

export function useHospitalityProperties() {
  return useSupabaseTable<HospitalityProperty>('hospitality_properties')
}

export function useCustomers(propertyId?: string) {
  return useSupabaseTable<Customer>('customers', propertyId ? { property_id: propertyId } : undefined)
}

export function useBookings(propertyId?: string) {
  return useSupabaseTable<Booking>('bookings', propertyId ? { property_id: propertyId } : undefined)
}

export function useEmployees(propertyId?: string) {
  return useSupabaseTable<Employee>('employees', propertyId ? { property_id: propertyId } : undefined)
}

export function usePayrollRecords(employeeId?: string) {
  return useSupabaseTable<PayrollRecord>('payroll_records', employeeId ? { employee_id: employeeId } : undefined)
}

export function useFinancialTransactions(propertyId?: string) {
  return useSupabaseTable<FinancialTransaction>('financial_transactions', propertyId ? { property_id: propertyId } : undefined)
}

export function useCommissions(propertyId?: string) {
  return useSupabaseTable<Commission>('commissions', propertyId ? { property_id: propertyId } : undefined)
}

export function useInvoices(propertyId?: string) {
  return useSupabaseTable<Invoice>('invoices', propertyId ? { property_id: propertyId } : undefined)
}

export function useSubscriptions(propertyId?: string) {
  return useSupabaseTable<Subscription>('subscriptions', propertyId ? { property_id: propertyId } : undefined)
}

export function useServiceFees(propertyId?: string) {
  return useSupabaseTable<ServiceFee>('service_fees', propertyId ? { property_id: propertyId } : undefined)
}

export function useCalendarEvents(propertyId?: string) {
  return useSupabaseTable<CalendarEvent>('calendar_events', propertyId ? { property_id: propertyId } : undefined)
}

export function useResources(propertyId?: string) {
  return useSupabaseTable<Resource>('resources', propertyId ? { property_id: propertyId } : undefined)
}

export function useSchedules(propertyId?: string) {
  return useSupabaseTable<Schedule>('schedules', propertyId ? { property_id: propertyId } : undefined)
}

// Authentication hook
export function useAuth() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return {
    user,
    loading,
    signOut
  }
}
