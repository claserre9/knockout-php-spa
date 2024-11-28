<?php
namespace App;

use Doctrine\Common\EventManager;
use Doctrine\DBAL\DriverManager;
use Doctrine\DBAL\Tools\DsnParser;
use Doctrine\ORM\Configuration;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\Mapping\Driver\AttributeDriver;
use Symfony\Component\Cache\Adapter\PhpFilesAdapter;
use Symfony\Component\Cache\Adapter\RedisAdapter;

class EntityManagerFactory
{
    /**
     * Creates a new instance of the EntityManager.
     *
     * @return EntityManager|null The created EntityManager instance.
     *
     */
    public static function create(): EntityManager|null
    {
        $config = new Configuration;

        $isDev = isset($_ENV['APP_ENV']) && $_ENV['APP_ENV'] === 'development';

        self::setupCache($config, $isDev);

        if (isset($_ENV['DB_URL'])) {
            return self::setupEntityManager($config, $_ENV['DB_URL_PROD'], $isDev);
        }

        return null;
    }

    private static function setupCache(Configuration $config, bool $isDev): void
    {
        if ($isDev) {
            // Use PHP file cache for development
            $phpFileCache = new PhpFilesAdapter('development_cache');
            $config->setMetadataCache($phpFileCache);
            $config->setQueryCache($phpFileCache);
        } else {
            // Use Redis cache for production
            if (isset($_ENV['REDIS_URL'])) {
                $client = RedisAdapter::createConnection($_ENV['REDIS_URL']);
                $redisCache = new RedisAdapter($client);
                $config->setMetadataCache($redisCache);
                $config->setQueryCache($redisCache);
            }
        }
    }

    private static function setupEntityManager(Configuration $config, string $dbUrl, bool $isDev): EntityManager
    {
        $attributeDriverImpl = new AttributeDriver([__DIR__ . '/../src/'], true);
        $config->setMetadataDriverImpl($attributeDriverImpl);
        $config->setProxyDir(__DIR__ . '/../cache/proxies');
        $config->setProxyNamespace('App\Proxies');
        $config->setAutoGenerateProxyClasses($isDev);

        $dsnParser = new DsnParser();
        $connectionParams = $dsnParser->parse($dbUrl);
        $connection = DriverManager::getConnection($connectionParams);

        $eventManager = new EventManager();
        return new EntityManager($connection, $config, $eventManager);
    }
}