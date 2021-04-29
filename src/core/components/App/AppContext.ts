import { SignalRService } from 'services/SignalRService';
import { createContext } from 'react';
import { RouteConfig } from 'react-router-config';
export const SignalRContext = createContext<SignalRService>(null);
export const PermissionContext = createContext<string[]>([]);
export const MenuContext = createContext<RouteConfig[]>([]);
export const ActionContext = createContext<string[]>([]);
export const MenuRouteContext = createContext<Record<string, number>>({});
