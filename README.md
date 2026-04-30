# Drive Logger

### About
Checks Route For Driving And Stats


### Setup

1. Download Zip or clone repo
2. Open Repo
3. Run `npm install`
4. Run `npx expo start -c`
5. Scan QR Code



### Versions (Alpha V1.x)

#### v0.1 ✔
1. Implement Local Storage ✔ 
2. Add Navigation (Home, Profile, Drive) ✔
3. Implement Data Tracking and Logic ✔
4. Add Location Tracking and Map Routing ✔
5. Session History List ✔
6. Add Saves ✔
7. Update Session Names + Notes ✔
8. Create Waypoints/Checkpoint Markers ✔
9. Design + Polish ✔
10. Test Out App ✔

#### v0.2 ✔
1. Reorganize and structure and clean code. ✔
2. Add Max Speed Location On The Map, Make it Optional ✔
3. Open camera, take photo and add into checkpoint obj ✔
4. Whenever u press the checkpoint marker, modal pops up with details (Edit, Manage, Filter Checkpoints) ✔
5. Automatic stop detection (Counts and records where u stopped and how many time u have stopped) ✔
6. Add Checkpoint filters on the map ('checkpoint' | 'stop' | 'gas' | 'food' | 'issue' | 'scenery') ✔
7. UI/UX refinement and improvements ✔

#### v0.3
1. Migrate Async Data To SQLite ✔
    - Fix Saving ✔
    - Fix List Of Sessions ✔
    - Fix Session Details ✔
    - Fix Saves ✔
    - Fix Map ✔
    - Add all previous saves to sql data ✔

2. Add a pinned locations section ✔
    - pinned locations form (gets coords via inputted address) ✔
    - section to manage pinned locations (edit, delete, etc.) ✔
    - option to add checkpiint to pinned locations ✔
    - add navigation option to navigate to pinned location ✔

3. Free Roam Map
    - add 1st and 3rd person perspectives ✔
    - add standard & satellite option ✔
    - create pinned locations via map marker ✔
    - option to add a pinned location while in first person
    - navigation arrows for pinned locations
    - display save routes w/ controls
    - personal marker arrow

4. Clean Up


#### v0.4
1. Route Replay
2. Create first and third person when driving session on live
3. Add Settings or preferences in profile
4. Add Imperial/Metric Options


#### v0.5
1. Design and add smooth clean animations and UI.
2. Polish, Clean and Identify Edge cases
3. Live sessions still being recorded even in a different app or asleep (Runs in the background) 
4. Deploy To Public


#### V2 (TBD)