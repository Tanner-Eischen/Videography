/*
  # Add form data field to quotes table

  1. Changes
    - Add `form_data` column to `quotes` table to store complete quote form data as JSON
    - This allows us to restore the entire form when editing a quote
  
  2. Notes
    - Using JSONB type for efficient querying and indexing
    - Nullable field as existing quotes won't have this data
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'quotes' AND column_name = 'form_data'
  ) THEN
    ALTER TABLE quotes ADD COLUMN form_data JSONB;
  END IF;
END $$;
