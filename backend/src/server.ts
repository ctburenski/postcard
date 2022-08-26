import { init } from './lib/redisClient';
import app from './app';

(async () => {
	await init();
	app.listen(6060);
})();
