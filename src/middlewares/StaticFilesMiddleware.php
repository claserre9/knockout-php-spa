<?php

namespace App\middlewares;

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface as RequestHandler;
use Slim\Psr7\Factory\StreamFactory;

class StaticFilesMiddleware implements MiddlewareInterface
{
    public function process(Request $request, RequestHandler $handler): Response
    {
        $uri = $request->getUri()->getPath();
        $filePath = __DIR__ . '/../../public' . $uri;

        if (file_exists($filePath) && is_file($filePath)) {
            $streamFactory = new StreamFactory();
            $stream = $streamFactory->createStreamFromFile($filePath);

            $response = new \Slim\Psr7\Response();
            return $response
                ->withHeader('Content-Type', mime_content_type($filePath))
                ->withBody($stream);
        }
        return $handler->handle($request);
    }
}
