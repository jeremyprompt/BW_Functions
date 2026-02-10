/**
 * Utility to parse Bandwidth API XML responses
 */

export interface ParsedTnOptionOrder {
  orderId?: string;
  processingStatus?: string;
  errors: string[];
  warnings: string[];
  phoneNumbers: string[];
}

export function parseTnOptionOrderResponse(xmlText: string): ParsedTnOptionOrder {
  const result: ParsedTnOptionOrder = {
    errors: [],
    warnings: [],
    phoneNumbers: [],
  };

  try {
    // Simple XML parsing using regex (for browser compatibility)
    // Extract OrderId
    const orderIdMatch = xmlText.match(/<OrderId[^>]*>([^<]+)<\/OrderId>/i);
    if (orderIdMatch) {
      result.orderId = orderIdMatch[1].trim();
    }

    // Extract ProcessingStatus
    const statusMatch = xmlText.match(/<ProcessingStatus[^>]*>([^<]+)<\/ProcessingStatus>/i);
    if (statusMatch) {
      result.processingStatus = statusMatch[1].trim();
    }

    // Extract Errors
    const errorsMatch = xmlText.match(/<Errors[^>]*>([\s\S]*?)<\/Errors>/i);
    if (errorsMatch) {
      const errorsContent = errorsMatch[1];
      const errorMatches = errorsContent.match(/<Error[^>]*>([^<]+)<\/Error>/gi);
      if (errorMatches) {
        errorMatches.forEach((errorTag) => {
          const errorTextMatch = errorTag.match(/>([^<]+)</);
          if (errorTextMatch) {
            result.errors.push(errorTextMatch[1].trim());
          }
        });
      }
      // Also check for direct error text
      if (errorsContent && !errorMatches && errorsContent.trim()) {
        result.errors.push(errorsContent.trim());
      }
    }

    // Extract Warnings
    const warningsMatch = xmlText.match(/<Warnings[^>]*>([\s\S]*?)<\/Warnings>/i);
    if (warningsMatch) {
      const warningsContent = warningsMatch[1];
      const warningMatches = warningsContent.match(/<Warning[^>]*>([^<]+)<\/Warning>/gi);
      if (warningMatches) {
        warningMatches.forEach((warningTag) => {
          const warningTextMatch = warningTag.match(/>([^<]+)</);
          if (warningTextMatch) {
            result.warnings.push(warningTextMatch[1].trim());
          }
        });
      }
      // Also check for direct warning text
      if (warningsContent && !warningMatches && warningsContent.trim()) {
        result.warnings.push(warningsContent.trim());
      }
    }

    // Extract Phone Numbers
    const phoneNumbersMatch = xmlText.match(/<TelephoneNumbers[^>]*>([\s\S]*?)<\/TelephoneNumbers>/i);
    if (phoneNumbersMatch) {
      const phoneNumbersContent = phoneNumbersMatch[1];
      const phoneMatches = phoneNumbersContent.match(/<TelephoneNumber[^>]*>([^<]+)<\/TelephoneNumber>/gi);
      if (phoneMatches) {
        phoneMatches.forEach((phoneTag) => {
          const phoneTextMatch = phoneTag.match(/>([^<]+)</);
          if (phoneTextMatch) {
            result.phoneNumbers.push(phoneTextMatch[1].trim());
          }
        });
      }
    }
  } catch (error) {
    // If parsing fails, return empty result
    console.error('Error parsing XML:', error);
  }

  return result;
}
