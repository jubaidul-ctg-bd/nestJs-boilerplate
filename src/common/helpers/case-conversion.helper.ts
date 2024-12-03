export function snakeCaseToCamelCase(snakeCaseStr: string): string {
    return snakeCaseStr.replace(/_([a-z])/g, (_, letter) =>
        letter.toUpperCase()
    )
}

function isValidJson(jsonString: string): boolean {
    try {
        JSON.parse(jsonString)
        return true // The string is valid JSON
    } catch (error) {
        return false // The string is not valid JSON
    }
}

export function convertKeysToCamelCase(
    obj: any,
    fieldsToConvert?: string[]
): any {
    return Object.keys(obj).reduce((acc, key) => {
        const camelCaseKey = snakeCaseToCamelCase(key)
        obj[key] = isValidJson(obj[key]) ? JSON.parse(obj[key]) : obj[key]
        if (camelCaseKey == 'createdAt' && obj[key] == 'NULL') {
            obj[key] = new Date()
        }
        acc[camelCaseKey] = fieldsToConvert.includes(camelCaseKey)
            ? Number(obj[key])
            : obj[key]
        return acc
    }, {})
}

export function convertToSlug(str: string): string {
    try {
        return str
            .toLowerCase() // Convert to lowercase
            .trim() // Remove leading/trailing whitespace
            .replace(/\s+/g, '-') // Replace spaces with hyphens
    } catch (error) {
        return ''
    }
}

// Function to calculate age
export const calculateAge = (dateOfBirth) => {
    const birthDate = new Date(dateOfBirth)
    const today = new Date()
    const age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()

    if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
        return age - 1
    }
    return age
}
