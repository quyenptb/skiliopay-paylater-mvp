import express from 'express';
import cors from 'cors';
import payLaterRoutes from './routes/payLaterRoutes';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/paylater', payLaterRoutes);

// Load OpenAPI file
//const swaggerDocument = YAML.load('./openapi.yaml');

// Serve swagger
//app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


const PORT = process.env.PORT || 3000;

/*
app.listen(PORT, () => {
  console.log('Server running on http://localhost:3000/docs');
}); */

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

