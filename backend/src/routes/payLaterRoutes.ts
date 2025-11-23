import { Router, Request, Response } from 'express';
import { PayLaterService } from '../services/payLaterService';
import { authenticate, authorizeUser } from '../middleware/auth';

const router = Router();
const service = new PayLaterService();

router.use(authenticate);

router.post('/eligibility', (req, res) => {
  try {
    const userId = (req as any).user.id;
    const { amount } = req.body;

    if (amount === undefined) {
      return res.status(400).json({ error: 'Amount is required' });
    }

    const num = Number(amount);
    if (Number.isNaN(num)) {
      return res.status(400).json({ error: 'Amount must be numeric' });
    }

    return res.json(service.checkEligibility(userId, num));
  } catch {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/create', (req: Request, res: Response) => {
  try {
    const { cartId } = req.body;
    const userId = (req as any).user.id;

    if (!cartId) {
      return res.status(400).json({ error: 'CartId is required' });
    }

    const agreement = service.createAgreement(userId, cartId);
    return res.status(201).json(agreement);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});

router.get('/plans/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const details = service.getAgreementDetails(id);
    const userId = (req as any).user.id;

    if (!details || !details.agreement) {
    return res.status(404).json({ error: 'Plan not found' });
}
    if (details.agreement.userId !== userId) {
        return res.status(403).json({ error: 'Forbidden' });
    }
    return res.json(details);
  } catch (error) {
    return res.status(404).json({ error: 'Plan not found' });
  }
});


router.get('/config', (req: Request, res: Response) => {
  return res.json(service.getConfig());
});

router.get('/my-plans', (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const agreements = service.getUserAgreements(userId);
    return res.json(agreements);
  } catch (error) {
    return res.status(500).json({ error: 'Internal error' });
  }
});

router.post('/pay/error/:installmentId', (req: Request, res: Response) => {
  try {
    const { installmentId } = req.params;
    const { simulateFailure } = req.body; 

    const result = service.retryInstallmentPayment(installmentId, simulateFailure === true);
    
    if (!result.success) {
      return res.status(402).json(result);
    }
    return res.json(result);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});


router.post('/pay/:installmentId', (req: Request, res: Response) => {
  try {
    const { installmentId } = req.params;
    const { simulateFailure } = req.body; 

    const result = service.retryInstallmentPayment(installmentId, simulateFailure === true);
    
    if (!result.success) {
      return res.status(402).json(result);
    }
    return res.json(result);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
});



router.get('/user/:userId', (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const user = service.getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});




export default router;