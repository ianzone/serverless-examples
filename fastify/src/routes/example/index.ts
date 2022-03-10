import { FastifyPluginAsync } from 'fastify';

interface BodyAttr {
  attr: string;
}

const example: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get<{ Body: BodyAttr }>('/', async (req, res) => {
    console.log(req.body.attr);
    return 'this is an example';
  });
};

export default example;
