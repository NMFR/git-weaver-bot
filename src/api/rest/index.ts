import express from 'express';

const router = express.Router();

router.post('/gitlab', (request, response) => {
  console.log(request.body);

  return response.status(200).send();
});

export default router;
