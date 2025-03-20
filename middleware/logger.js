const logger = (req, res, next) => {
    // Registra o início da requisição
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - Início`);

    // Captura o tempo de início
    const start = Date.now();

    // Intercepta o evento de fim da resposta
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} ${res.statusCode} - ${duration}ms`);
    });

    // Passa para o próximo middleware
    next();
};

module.exports = logger;