
-- Phase 1a: Add 'admin' to app_role enum
ALTER TYPE app_role ADD VALUE IF NOT EXISTS 'admin';
