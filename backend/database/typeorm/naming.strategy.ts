import * as pluralize from 'pluralize';
import { DefaultNamingStrategy } from 'typeorm';
import { snakeCase } from 'typeorm/util/StringUtils';

export class NamingStrategy extends DefaultNamingStrategy {
    tableName(targetName: string, userSpecifiedName: string | undefined): string {
        return userSpecifiedName || pluralize(snakeCase(targetName));
    }

    columnName(
        propertyName: string,
        customName: string,
        embeddedPrefixes: string[],
    ): string {
        return (
            snakeCase(embeddedPrefixes.join('_')) +
            (customName || snakeCase(propertyName))
        );
    }
}