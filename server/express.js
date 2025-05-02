import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compress from 'compression';
import cors from 'cors';
import helmet from 'helmet';
import clinicRoutes from './routes/clinic.routes.js'; 
import checkoutRoutes from './routes/checkout.routes.js';  
import userRoutes from './routes/user.routes.js';
import appointmentRoutes from './routes/appointment.routes.js';
import patientRoutes from './routes/patient.routes.js';
import sigmapanelRoutes from './routes/sigmapanel.routes.js';


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compress());
app.use(helmet());
app.use(cors());

app.use('/api/clinics', clinicRoutes); 
app.use('/api/sigmapanels', sigmapanelRoutes); 
app.use('/api/checkouts', checkoutRoutes); 
app.use('/api/users', userRoutes); 
app.use('/api/appointments', appointmentRoutes);
app.use('/api/patients', patientRoutes);


export default app;
