<?php

namespace App\controllers\api;

use App\controllers\AbstractController;
use App\repositories\redis\LipsumRepository;
use Psr\Http\Message\ResponseInterface;
use Slim\Psr7\Request;
use Slim\Psr7\Response;

/**
 * AuthController is responsible for handling user authentication actions
 * such as registration, login, and logout.
 */
class AuthController extends AbstractController
{

    /**
     * Handles registration
     *
     * @param Request $request
     * @param Response $response
     * @param array $args
     * @return ResponseInterface|null
     */
    public function register(Request $request, Response $response, array $args): ?ResponseInterface
    {
        
    }

    /**
     * Handles login
     *
     * @param Request $request
     * @param Response $response
     * @param array $args
     * @return ResponseInterface|null
     */
    public function login(Request $request, Response $response, array $args): ?ResponseInterface
    {

    }

    /**
     * Handles logout
     *
     * @param Request $request
     * @param Response $response
     * @param array $args
     * @return ResponseInterface|null
     */
    public function logout(Request $request, Response $response, array $args): ?ResponseInterface
    {

    }


}