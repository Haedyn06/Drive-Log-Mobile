import { getSavedSessionsDB } from "@/database/methods/savedSessions";
import { getDriveSessions, getFullDriveSessions } from "./sessionService";

export const getSavedSessions = async () => 
    getDriveSessions(await getSavedSessionsDB());

export const getSavedFullSessions = async () => 
    getFullDriveSessions(await getSavedSessionsDB());