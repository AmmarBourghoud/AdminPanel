import React from 'react';

const Signals = React.lazy(() => import('./views/Signals/Signals'));
const SignalsMap = React.lazy(() => import('./views/Signals/SignalsMap'));
const Signal = React.lazy(() => import('./views/Signals/Signal'));

// the routes of the 3 pages and theire components
const routes = [
  { path: '/signals/', exact: true, name: 'Liste des tous les signalements', component: Signals },
  { path: '/signals-map/', exact: true, name: 'Localisation des signalements sur une carte', component: SignalsMap },
  { path: '/signal/:id/', exact: true, name: 'Information sur un signalement', component: Signal },
];

export default routes;
