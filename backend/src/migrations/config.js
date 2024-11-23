const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs').promises;

// MongoDB connection URL
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/test';

// Migration model schema
const MigrationSchema = new mongoose.Schema({
    filename: { type: String, required: true, unique: true },
    appliedAt: { type: Date, default: Date.now }
});

const Migration = mongoose.model('Migration', MigrationSchema);

// Function to get all migration files
async function getMigrationFiles() {
    const migrationsDir = path.join(__dirname);
    const files = await fs.readdir(migrationsDir);
    return files
        .filter(file => file.endsWith('.migration.js'))
        .sort();
}

// Function to get pending migrations
async function getPendingMigrations() {
    const appliedMigrations = await Migration.find().select('filename');
    const appliedMigrationNames = new Set(appliedMigrations.map(m => m.filename));
    const migrationFiles = await getMigrationFiles();
    
    return migrationFiles.filter(filename => 
        !appliedMigrationNames.has(filename) && filename !== 'config.js'
    );
}

// Function to run migrations
async function runMigrations() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const pendingMigrations = await getPendingMigrations();
        
        if (pendingMigrations.length === 0) {
            console.log('No pending migrations');
            return;
        }

        console.log(`Found ${pendingMigrations.length} pending migrations`);

        for (const migrationFile of pendingMigrations) {
            try {
                const migration = require(path.join(__dirname, migrationFile));
                console.log(`Running migration: ${migrationFile}`);
                await migration.up();
                await Migration.create({ filename: migrationFile });
                console.log(`Completed migration: ${migrationFile}`);
            } catch (error) {
                console.error(`Error running migration ${migrationFile}:`, error);
                throw error;
            }
        }

        console.log('All migrations completed successfully');
    } catch (error) {
        console.error('Migration error:', error);
        throw error;
    } finally {
        await mongoose.connection.close();
    }
}

module.exports = {
    runMigrations,
    getPendingMigrations,
    Migration
};
