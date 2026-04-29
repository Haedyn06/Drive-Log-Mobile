export const createTablesSQL = `
    PRAGMA foreign_keys = ON;

    -- Drive Session
    CREATE TABLE IF NOT EXISTS drive_session (
        id TEXT PRIMARY KEY NOT NULL,
        title TEXT NOT NULL,
        date INTEGER NOT NULL,
        notes TEXT,
        elapsed_time INTEGER NOT NULL,
        timestamp_start INTEGER NOT NULL,
        timestamp_end INTEGER NOT NULL,
        start_location_name TEXT,
        latitude_start REAL NOT NULL,
        longitude_start REAL NOT NULL,
        altitude_start REAL,
        end_location_name TEXT,
        latitude_end REAL NOT NULL,
        longitude_end REAL NOT NULL,
        altitude_end REAL,
        average_speed REAL,
        altitude_gained REAL NOT NULL,
        distance REAL NOT NULL,
        vehicle_id TEXT,
        FOREIGN KEY (vehicle_id) REFERENCES vehicle(id) ON DELETE SET NULL
    );


    -- Checkpoints
    CREATE TABLE IF NOT EXISTS checkpoints (
        id TEXT PRIMARY KEY NOT NULL,
        session_id TEXT NOT NULL,
        type TEXT NOT NULL,
        notes TEXT,
        distance REAL NOT NULL,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        altitude REAL,
        timestamp INTEGER NOT NULL,
        FOREIGN KEY (session_id) REFERENCES drive_session(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS checkpoint_images (
        id TEXT PRIMARY KEY NOT NULL,
        checkpoint_id TEXT NOT NULL,
        uri TEXT NOT NULL,
        FOREIGN KEY (checkpoint_id) REFERENCES checkpoints(id) ON DELETE CASCADE
    );



    -- Mapped Points
    CREATE TABLE IF NOT EXISTS routepoints (
        session_id TEXT NOT NULL,
        point_index INTEGER NOT NULL,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        altitude REAL,
        timestamp INTEGER NOT NULL,
        PRIMARY KEY (session_id, point_index),
        FOREIGN KEY (session_id) REFERENCES drive_session(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS stoppoints (
        session_id TEXT NOT NULL,
        point_index INTEGER NOT NULL,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        altitude REAL,
        duration INTEGER NOT NULL,
        timestamp INTEGER NOT NULL,
        PRIMARY KEY (session_id, point_index),
        FOREIGN KEY (session_id) REFERENCES drive_session(id) ON DELETE CASCADE
    );



    -- Metrics
    CREATE TABLE IF NOT EXISTS top_speeds (
        session_id TEXT PRIMARY KEY NOT NULL,
        speed REAL NOT NULL,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        altitude REAL,
        timestamp INTEGER NOT NULL,
        FOREIGN KEY (session_id) REFERENCES drive_session(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS top_altitudes (
        session_id TEXT PRIMARY KEY NOT NULL,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        altitude REAL NOT NULL,
        timestamp INTEGER NOT NULL,
        FOREIGN KEY (session_id) REFERENCES drive_session(id) ON DELETE CASCADE
    );



    -- Vehicle
    CREATE TABLE IF NOT EXISTS vehicle (
        id TEXT PRIMARY KEY NOT NULL,
        year TEXT NOT NULL,
        brand TEXT NOT NULL,
        model TEXT NOT NULL,
        color TEXT NOT NULL,
        license TEXT
    );


    -- Saves
    CREATE TABLE IF NOT EXISTS session_saves (
        session_id TEXT PRIMARY KEY NOT NULL,
        timestamp INTEGER NOT NULL,
        FOREIGN KEY (session_id) REFERENCES drive_session(id) ON DELETE CASCADE
    );
`;



