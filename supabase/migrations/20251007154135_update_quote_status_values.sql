/*
  # Update quote status values
  
  1. Changes
    - Update status constraint to include 'downloaded' instead of 'exported'
    - This allows quotes to have status values: draft, downloaded, emailed, done
  
  2. Security
    - No changes to RLS policies
*/

-- Drop the existing constraint
ALTER TABLE quotes DROP CONSTRAINT IF EXISTS quotes_status_check;

-- Add the new constraint with 'downloaded' instead of 'exported'
ALTER TABLE quotes ADD CONSTRAINT quotes_status_check 
  CHECK (status = ANY (ARRAY['draft'::text, 'downloaded'::text, 'emailed'::text, 'done'::text]));