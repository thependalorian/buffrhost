const { Pool } = require('pg');
require('dotenv').config();

async function checkDatabaseStructure() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('🗄️ Connecting to database and checking structure...\n');
    
    // Test connection
    const client = await pool.connect();
    console.log('✅ Database connection successful\n');

    // Get all tables
    const tablesQuery = `
      SELECT table_name, table_type 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `;
    
    const tablesResult = await client.query(tablesQuery);
    console.log('📋 Database Tables:');
    console.log('==================');
    tablesResult.rows.forEach(row => {
      console.log(`- ${row.table_name} (${row.table_type})`);
    });
    console.log(`\nTotal tables: ${tablesResult.rows.length}\n`);

    // Get detailed structure for each table
    for (const table of tablesResult.rows) {
      console.log(`\n🔍 Table: ${table.table_name}`);
      console.log('='.repeat(50));
      
      // Get columns
      const columnsQuery = `
        SELECT 
          column_name,
          data_type,
          is_nullable,
          column_default,
          character_maximum_length
        FROM information_schema.columns 
        WHERE table_name = $1 
        ORDER BY ordinal_position;
      `;
      
      const columnsResult = await client.query(columnsQuery, [table.table_name]);
      
      console.log('Columns:');
      columnsResult.rows.forEach(col => {
        const length = col.character_maximum_length ? `(${col.character_maximum_length})` : '';
        const nullable = col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL';
        const defaultVal = col.column_default ? ` DEFAULT ${col.column_default}` : '';
        console.log(`  - ${col.column_name}: ${col.data_type}${length} ${nullable}${defaultVal}`);
      });

      // Get constraints
      const constraintsQuery = `
        SELECT 
          tc.constraint_name,
          tc.constraint_type,
          kcu.column_name,
          ccu.table_name AS foreign_table_name,
          ccu.column_name AS foreign_column_name
        FROM information_schema.table_constraints AS tc
        LEFT JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
        LEFT JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
        WHERE tc.table_name = $1
        ORDER BY tc.constraint_type, tc.constraint_name;
      `;
      
      const constraintsResult = await client.query(constraintsQuery, [table.table_name]);
      
      if (constraintsResult.rows.length > 0) {
        console.log('\nConstraints:');
        constraintsResult.rows.forEach(constraint => {
          if (constraint.constraint_type === 'FOREIGN KEY') {
            console.log(`  - ${constraint.constraint_type}: ${constraint.column_name} -> ${constraint.foreign_table_name}.${constraint.foreign_column_name}`);
          } else {
            console.log(`  - ${constraint.constraint_type}: ${constraint.column_name || constraint.constraint_name}`);
          }
        });
      }

      // Get indexes
      const indexesQuery = `
        SELECT 
          indexname,
          indexdef
        FROM pg_indexes 
        WHERE tablename = $1
        ORDER BY indexname;
      `;
      
      const indexesResult = await client.query(indexesQuery, [table.table_name]);
      
      if (indexesResult.rows.length > 0) {
        console.log('\nIndexes:');
        indexesResult.rows.forEach(index => {
          console.log(`  - ${index.indexname}`);
        });
      }

      // Get row count
      const countQuery = `SELECT COUNT(*) as count FROM ${table.table_name};`;
      try {
        const countResult = await client.query(countQuery);
        console.log(`\nRow count: ${countResult.rows[0].count}`);
      } catch (err) {
        console.log('\nRow count: Unable to count (permission or view)');
      }
    }

    // Get database size
    const sizeQuery = `
      SELECT 
        pg_size_pretty(pg_database_size(current_database())) as database_size,
        current_database() as database_name,
        current_user as current_user,
        version() as postgres_version;
    `;
    
    const sizeResult = await client.query(sizeQuery);
    console.log('\n📊 Database Information:');
    console.log('========================');
    console.log(`Database: ${sizeResult.rows[0].database_name}`);
    console.log(`User: ${sizeResult.rows[0].current_user}`);
    console.log(`Size: ${sizeResult.rows[0].database_size}`);
    console.log(`PostgreSQL Version: ${sizeResult.rows[0].postgres_version.split(' ')[0]}`);

    // Check for RLS policies
    const rlsQuery = `
      SELECT 
        schemaname,
        tablename,
        policyname,
        permissive,
        roles,
        cmd,
        qual,
        with_check
      FROM pg_policies 
      WHERE schemaname = 'public'
      ORDER BY tablename, policyname;
    `;
    
    const rlsResult = await client.query(rlsQuery);
    
    if (rlsResult.rows.length > 0) {
      console.log('\n🔒 Row Level Security Policies:');
      console.log('===============================');
      rlsResult.rows.forEach(policy => {
        console.log(`- ${policy.tablename}.${policy.policyname} (${policy.cmd})`);
      });
    } else {
      console.log('\n🔒 Row Level Security: No policies found');
    }

    client.release();
    console.log('\n✅ Database structure check complete!');
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('Stack trace:', error.stack);
  } finally {
    await pool.end();
  }
}

checkDatabaseStructure();