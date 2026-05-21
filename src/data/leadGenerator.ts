export const generateRandomLead = (config: any = {}) => {
  const names = ['André', 'Bia', 'Carlos', 'Dani', 'Edu', 'Fernanda'];
  const vehicles = ['PCX', 'NMAX', 'XRE', 'MT-03'];
  const origin = Math.random() > 0.5 ? 'Instagram Ads' : 'Google Ads';
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    name: config.name || names[Math.floor(Math.random() * names.length)],
    vehicleInterest: config.interest || vehicles[Math.floor(Math.random() * vehicles.length)],
    origin,
    score: Math.floor(Math.random() * 60) + 20,
    createdAt: new Date()
  };
};
