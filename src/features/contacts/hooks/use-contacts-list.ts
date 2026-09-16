import { useQuery } from '@tanstack/react-query'
import { ContactsApi, contactsQueryKeys, type ListContactsParams } from '../services/contacts-api'

export function useContactsList(query?: Partial<ListContactsParams>) {
  return useQuery({
    queryKey: contactsQueryKeys.list(query),
    queryFn: () => ContactsApi.list(query),
  })
}
