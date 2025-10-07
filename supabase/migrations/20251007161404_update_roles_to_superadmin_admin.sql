/*
  # Update Role System to SuperAdmin and Admin

  1. Changes
    - Update the role check constraint to allow 'superadmin' and 'admin' instead of 'admin' and 'client'
    - Update existing 'admin' roles to 'superadmin'
    - Update existing 'client' roles to 'admin'
  
  2. Notes
    - SuperAdmin has full access and can toggle between views
    - Admin has standard access (previous client functionality)
*/

-- Drop the existing constraint
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;

-- Update existing roles
UPDATE profiles SET role = 'superadmin' WHERE role = 'admin';
UPDATE profiles SET role = 'admin' WHERE role = 'client';

-- Add new constraint
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('superadmin', 'admin'));