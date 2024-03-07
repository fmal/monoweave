import { availableParallelism } from 'os'

import { gitResolveSha } from '@monoweave/git'
import { type MonoweaveConfiguration, type RecursivePartial, RegistryMode } from '@monoweave/types'
import { npath } from '@yarnpkg/fslib'

export const mergeDefaultConfig = async (
    baseConfig: RecursivePartial<MonoweaveConfiguration>,
): Promise<MonoweaveConfiguration> => {
    const cwd = npath.fromPortablePath(baseConfig.cwd ?? process.cwd())
    const prerelease = baseConfig.prerelease ?? false

    return {
        registryUrl: baseConfig.registryUrl ?? undefined,
        registryMode: baseConfig.registryMode ?? RegistryMode.NPM,
        cwd,
        dryRun: baseConfig.dryRun ?? false,
        git: {
            baseBranch: baseConfig.git?.baseBranch,
            commitSha: baseConfig.git?.commitSha ?? (await gitResolveSha('HEAD', { cwd })),
            remote: baseConfig.git?.remote ?? 'origin',
            push: baseConfig.git?.push ?? true,
            tag: baseConfig.git?.tag ?? true,
        },
        conventionalChangelogConfig: baseConfig.conventionalChangelogConfig ?? undefined,
        changesetFilename: baseConfig.changesetFilename ?? undefined,
        changelogFilename: baseConfig.changelogFilename ?? undefined,
        changesetIgnorePatterns: baseConfig.changesetIgnorePatterns ?? [],
        forceWriteChangeFiles: baseConfig.forceWriteChangeFiles ?? false,
        access: baseConfig.access ?? 'infer',
        persistVersions: baseConfig.persistVersions ?? true,
        autoCommit: baseConfig.autoCommit ?? true,
        autoCommitMessage: baseConfig.autoCommitMessage ?? 'chore: release [skip ci]',
        commitIgnorePatterns: baseConfig.commitIgnorePatterns ?? undefined,
        topological: baseConfig.topological ?? false,
        topologicalDev: baseConfig.topologicalDev ?? false,
        jobs: baseConfig.jobs ?? availableParallelism(),
        maxConcurrentReads: baseConfig.maxConcurrentReads ?? 0,
        maxConcurrentWrites: baseConfig.maxConcurrentWrites ?? 0,
        plugins: baseConfig.plugins ?? [],
        prerelease,
        prereleaseId: baseConfig.prereleaseId ?? 'rc',
        prereleaseNPMTag: baseConfig.prereleaseNPMTag ?? 'next',
        packageGroupManifestField: baseConfig.packageGroupManifestField ?? undefined,
        packageGroups: baseConfig.packageGroups,
        versionStrategy: {
            coerceImplicitPeerDependency:
                baseConfig.versionStrategy?.coerceImplicitPeerDependency ?? undefined,
            minimumStrategy: baseConfig.versionStrategy?.minimumStrategy ?? undefined,
            versionFolder: baseConfig.versionStrategy?.versionFolder || '.monoweave',
        },
    }
}
