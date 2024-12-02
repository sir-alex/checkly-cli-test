import * as api from '../rest/api'
import { utilsService } from './util'
import {
  AlertChannel,
  AlertChannelSubscription,
  Check,
  CheckGroup,
  Dashboard,
  MaintenanceWindow,
  PrivateLocation,
  PrivateLocationCheckAssignment,
  PrivateLocationGroupAssignment,
} from '../constructs'

type IResourcesConstruct =
  Check |
  CheckGroup |
  AlertChannel |
  AlertChannelSubscription |
  MaintenanceWindow |
  PrivateLocation |
  PrivateLocationCheckAssignment |
  PrivateLocationGroupAssignment |
  Dashboard
export type IResourcesTypes = 'alert-channel' | 'check'
export interface IResourceItem {
  resourceType: IResourcesTypes
  logicalId: string
  construct: IResourcesConstruct
}

export class DeployPreview {
  readonly resources: IResourceItem[] = []
  constructor (resources: IResourceItem[]) {
    this.resources = resources
  }

  private getUniqueResourceType (): IResourcesTypes[] {
    return utilsService.uniqValFromArrByKey(this.resources, 'resourceType')
  }

  private getAlertChannelsServerState () {
    return api.alertChannels.getAll()
  }

  private getServerStateByResourceType (resourceType: IResourcesTypes) {
    switch (resourceType) {
      case 'alert-channel':
        return this.getAlertChannelsServerState()
      default:
        return null
      /* throw new Error(`Resource type ${resourceType} is not supported`) */
    }
  }

  public getPreview (): Promise<any[]> {
    const resourcesTypes = this.getUniqueResourceType()
    return Promise.all(resourcesTypes.map(this.getServerStateByResourceType.bind(this)))
  }
}
