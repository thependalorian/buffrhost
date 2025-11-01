require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function getCompleteDatabaseInfo() {
  try {
    const client = await pool.connect();
    console.log('✅ Connected to Neon database successfully!');

    // Get all tables with detailed info
    const tablesResult = await client.query(`
      SELECT 
        table_name, 
        table_type,
        (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
      FROM information_schema.tables t
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);

    console.log(
      `\n=== COMPLETE DATABASE STRUCTURE (${tablesResult.rows.length} tables) ===`
    );

    // Process each table
    for (const table of tablesResult.rows) {
      console.log(`\n${'='.repeat(80)}`);
      console.log(
        `📋 ${table.table_type.toUpperCase()}: ${table.table_name} (${table.column_count} columns)`
      );
      console.log(`${'='.repeat(80)}`);

      // Get columns for this table
      const columnsResult = await client.query(`
        SELECT 
          column_name, 
          data_type, 
          is_nullable, 
          column_default,
          character_maximum_length,
          numeric_precision,
          numeric_scale
        FROM information_schema.columns 
        WHERE table_name = '${table.table_name}' 
        ORDER BY ordinal_position
      `);

      columnsResult.rows.forEach((col, index) => {
        const nullable = col.is_nullable === 'NO' ? 'NOT NULL' : 'NULL';
        const defaultVal = col.column_default
          ? ` DEFAULT ${col.column_default}`
          : '';
        const length = col.character_maximum_length
          ? `(${col.character_maximum_length})`
          : '';
        const precision = col.numeric_precision
          ? `(${col.numeric_precision}${col.numeric_scale ? ',' + col.numeric_scale : ''})`
          : '';

        console.log(
          `  ${index + 1}. ${col.column_name}: ${col.data_type}${length}${precision} ${nullable}${defaultVal}`
        );
      });

      // Get sample data for this table (limit 2 rows)
      try {
        const sampleResult = await client.query(
          `SELECT * FROM ${table.table_name} LIMIT 2`
        );
        if (sampleResult.rows.length > 0) {
          console.log(`\n  📊 SAMPLE DATA (${sampleResult.rows.length} rows):`);
          sampleResult.rows.forEach((row, index) => {
            console.log(`    Row ${index + 1}:`);
            Object.entries(row).forEach(([key, value]) => {
              const displayValue =
                typeof value === 'object'
                  ? JSON.stringify(value).substring(0, 50) +
                    (JSON.stringify(value).length > 50 ? '...' : '')
                  : String(value).substring(0, 50);
              console.log(`      ${key}: ${displayValue}`);
            });
            console.log('');
          });
        } else {
          console.log(`\n  📊 SAMPLE DATA: No data found`);
        }
      } catch (err) {
        console.log(`\n  📊 SAMPLE DATA: Error - ${err.message}`);
      }
    }

    // Get database statistics
    console.log(`\n${'='.repeat(80)}`);
    console.log(`📈 DATABASE STATISTICS`);
    console.log(`${'='.repeat(80)}`);

    const statsQueries = [
      {
        name: 'Total Tables',
        query:
          "SELECT COUNT(*) as count FROM information_schema.tables WHERE table_schema = 'public'",
      },
      {
        name: 'Total Views',
        query:
          "SELECT COUNT(*) as count FROM information_schema.views WHERE table_schema = 'public'",
      },
      {
        name: 'Total Functions',
        query:
          "SELECT COUNT(*) as count FROM information_schema.routines WHERE routine_schema = 'public'",
      },
      {
        name: 'Total Sequences',
        query:
          "SELECT COUNT(*) as count FROM information_schema.sequences WHERE sequence_schema = 'public'",
      },
    ];

    for (const stat of statsQueries) {
      try {
        const result = await client.query(stat.query);
        console.log(`${stat.name}: ${result.rows[0].count}`);
      } catch (err) {
        console.log(`${stat.name}: Error - ${err.message}`);
      }
    }

    // Get user roles enum values
    try {
      const enumResult = await client.query(`
        SELECT enumlabel 
        FROM pg_enum 
        WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'user_role_enum')
        ORDER BY enumsortorder
      `);
      console.log(
        `\nUser Roles: ${enumResult.rows.map((r) => r.enumlabel).join(', ')}`
      );
    } catch (err) {
      console.log(`User Roles: Error - ${err.message}`);
    }

    client.release();
    await pool.end();
    console.log(`\n${'='.repeat(80)}`);
    console.log(`✅ Database analysis complete!`);
    console.log(`${'='.repeat(80)}`);
  } catch (err) {
    console.error('❌ Database connection error:', err.message);
  }
}

getCompleteDatabaseInfo();
