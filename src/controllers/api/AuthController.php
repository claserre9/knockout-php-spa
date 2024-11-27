<?php

namespace App\controllers\api;

use App\controllers\AbstractController;
use App\repositories\redis\LipsumRepository;
use Psr\Http\Message\ResponseInterface;
use Slim\Psr7\Request;
use Slim\Psr7\Response;

class AuthController extends AbstractController
{

    /**
     * Handles registration
     *
     * @param Request $request
     * @param Response $response
     * @param array $args
     * @return ResponseInterface
     */
    public function register(Request $request, Response $response, array $args)
    {
        
    }

    /**
     * Handles login
     *
     * @param Request $request
     * @param Response $response
     * @param array $args
     * @return ResponseInterface
     */
    public function login(Request $request, Response $response, array $args): ResponseInterface
    {
        /** @var LipsumRepository $lipsumRepository */
        $lipsumRepository = $this->container(LipsumRepository::class);

        $data = $lipsumRepository->getData();

        $response->getBody()->write(json_encode(['message' => 'Login successful', 'data' => $data]));
        return $response->withHeader('Content-Type', 'application/json')->withStatus(200);
    }

    /**
     * Handles logout
     *
     * @param Request $request
     * @param Response $response
     * @param array $args
     * @return ResponseInterface
     */
    public function logout(Request $request, Response $response, array $args)
    {

    }


}