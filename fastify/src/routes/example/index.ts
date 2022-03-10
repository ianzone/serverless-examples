import { FastifyPluginAsync } from 'fastify';

const example: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get('/', async (req, res) => {
    return 'this is an example';
  });
};

export default example;
