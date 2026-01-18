# Database Backup Guide

This guide covers strategies for backing up your Lovable Cloud (Supabase) database.

## Overview

Your project uses Lovable Cloud which provides automatic daily backups. However, you may want additional backup strategies for development, migration, or extra safety.

---

## 1. Automatic Backups (Built-in)

Lovable Cloud automatically backs up your database daily. These backups are retained based on your plan:
- **Free tier**: 7 days retention
- **Pro tier**: 14 days retention

> Note: Point-in-time recovery is available on Pro plans.

---

## 2. Manual Export via SQL

You can export your data using the Supabase SQL editor or CLI.

### Export a single table to CSV:
```sql
COPY (SELECT * FROM your_table) TO '/tmp/your_table.csv' WITH CSV HEADER;
```

### Export specific data:
```sql
COPY (
  SELECT * FROM students 
  WHERE created_at > '2025-01-01'
) TO '/tmp/students_backup.csv' WITH CSV HEADER;
```

---

## 3. Using pg_dump (Recommended for Full Backups)

For complete database backups, use `pg_dump` with your database connection string.

### Prerequisites:
- PostgreSQL client installed locally
- Database connection string (available in Supabase dashboard)

### Full database backup:
```bash
pg_dump "postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres" > backup_$(date +%Y%m%d).sql
```

### Schema only (no data):
```bash
pg_dump --schema-only "postgresql://..." > schema_backup.sql
```

### Data only (no schema):
```bash
pg_dump --data-only "postgresql://..." > data_backup.sql
```

### Specific tables only:
```bash
pg_dump -t students -t profiles "postgresql://..." > selected_tables.sql
```

---

## 4. JavaScript/TypeScript Export

You can create an edge function or script to export data:

```typescript
import { supabase } from "@/integrations/supabase/client";

async function exportTable(tableName: string) {
  const { data, error } = await supabase
    .from(tableName)
    .select('*');
  
  if (error) throw error;
  
  // Convert to JSON and download
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `${tableName}_${new Date().toISOString().split('T')[0]}.json`;
  a.click();
}

// Export multiple tables
async function fullBackup() {
  const tables = ['students', 'profiles', 'lessons', 'student_task_responses'];
  for (const table of tables) {
    await exportTable(table);
  }
}
```

---

## 5. Scheduled Backups via Edge Function

Create an edge function that runs on a schedule:

```typescript
// supabase/functions/scheduled-backup/index.ts
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

Deno.serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  const tables = ['students', 'profiles', 'student_task_responses'];
  const backup: Record<string, any[]> = {};

  for (const table of tables) {
    const { data } = await supabase.from(table).select('*');
    backup[table] = data || [];
  }

  // Store backup in storage bucket or send to external service
  const timestamp = new Date().toISOString();
  
  // Option 1: Store in Supabase Storage
  await supabase.storage
    .from('backups')
    .upload(`backup_${timestamp}.json`, JSON.stringify(backup));

  return new Response(JSON.stringify({ success: true, timestamp }));
});
```

---

## 6. Third-Party Backup Services

Consider these services for automated backups:
- **Supabase CLI** - Official tool for migrations and backups
- **Snaplet** - Database snapshots and seeding
- **PostgreSQL backup services** - Compatible with any PostgreSQL backup tool

---

## 7. Best Practices

### Backup Frequency
| Data Type | Recommended Frequency |
|-----------|----------------------|
| Critical user data | Daily |
| Configuration/settings | Weekly |
| Development/test data | Before major changes |

### Backup Checklist
- [ ] Verify backup file is not empty
- [ ] Test restore process periodically
- [ ] Store backups in multiple locations
- [ ] Encrypt sensitive backup files
- [ ] Document restore procedures
- [ ] Set up backup monitoring/alerts

### Storage Locations
1. **Local development machine**
2. **Cloud storage** (S3, Google Cloud, etc.)
3. **Version control** (for schema/migrations only)
4. **Supabase Storage bucket**

---

## 8. Restoring from Backup

### From SQL dump:
```bash
psql "postgresql://..." < backup_file.sql
```

### From JSON export:
```typescript
async function restoreTable(tableName: string, data: any[]) {
  const { error } = await supabase
    .from(tableName)
    .insert(data);
  
  if (error) console.error(`Error restoring ${tableName}:`, error);
}
```

---

## Important Notes

1. **RLS Policies**: Backups don't include RLS policies by default with data-only exports
2. **Foreign Keys**: Restore tables in correct order to respect foreign key constraints
3. **Auth Users**: The `auth.users` table requires special handling and is managed by Supabase
4. **Large Datasets**: Use pagination for tables with >10,000 rows

---

## Quick Reference

| Method | Best For | Complexity |
|--------|----------|------------|
| Automatic backups | Daily safety net | None |
| pg_dump | Full database backup | Medium |
| JS/TS export | Specific tables | Low |
| Edge function | Scheduled automation | Medium |

---

*Last updated: January 2025*
