<?php
namespace App\controllers;

use Doctrine\ORM\EntityManagerInterface;
use Psr\Container\ContainerExceptionInterface;
use Psr\Container\ContainerInterface;
use Psr\Container\NotFoundExceptionInterface;
use Psr\Http\Message\ResponseInterface;
use Redis;


/**
 * AbstractController serves as a base controller providing common functionality
 * such as access to a dependency injection container, entity manager, and Redis integration.
 */
abstract class AbstractController
{
    protected const string JSON_CONTENT_TYPE = 'application/json';

    protected ?ContainerInterface $container;
    protected ?EntityManagerInterface $entityManager;
    protected ?Redis $redis;

    /**
     * Retrieves the current container.
     *
     * @return ContainerInterface|null The container instance if available, or null otherwise.
     */
    public function getContainer(): ?ContainerInterface
    {
        return $this->container;
    }

    /**
     * Retrieves the current entity manager.
     *
     * @return EntityManagerInterface|null The entity manager instance if available, or null otherwise.
     */
    public function getEntityManager(): ?EntityManagerInterface
    {
        return $this->entityManager;
    }

    /**
     * Retrieves the Redis instance associated with this object.
     *
     * @return Redis|null The Redis instance if available; null otherwise.
     */
    public function getRedis(): ?Redis
    {
        return $this->redis;
    }

    /**
     * Constructor to initialize dependencies.
     *
     * @param ContainerInterface|null $container The container interface instance, or null if not provided.
     * @param EntityManagerInterface|null $entityManager The entity manager instance, or null if not provided.
     * @param Redis|null $redis The Redis instance, or null if not provided.
     *
     * @return void
     */
    public function __construct(
        ?ContainerInterface $container,
        ?EntityManagerInterface $entityManager,
        ?Redis $redis
    )
    {
        $this->container = $container;
        $this->entityManager = $entityManager;
        $this->redis = $redis;
    }

    /**
     * Generates a JSON response with the provided payload and status code.
     *
     * @param ResponseInterface $response The response object.
     * @param array|string $payload The JSON payload to be written to the response body.
     * @param int $status The HTTP status code (default: 200).
     * @return ResponseInterface modified response object.
     */
    protected function json(ResponseInterface $response, array|string $payload, int $status = 200): ResponseInterface
    {
        if (is_array($payload)) {
            $payload = json_encode($payload);
        }

        $response->getBody()->write($payload);
        return $this->addJsonHeaders($response, $status);
    }

    /**
     * Adds JSON headers and HTTP status to the response.
     *
     * @param ResponseInterface $response The response object.
     * @param int $status The HTTP status code.
     * @return ResponseInterface modified response object.
     */
    private function addJsonHeaders(ResponseInterface $response, int $status): ResponseInterface
    {
        return $response
            ->withHeader('Content-Type', self::JSON_CONTENT_TYPE)
            ->withStatus($status);
    }

    public function container(string $name)
    {
        try {
            return $this->container->get($name);
        } catch (NotFoundExceptionInterface|ContainerExceptionInterface $e) {
            error_log("Container error: {$e->getMessage()}");
            return null;
        }
    }
}