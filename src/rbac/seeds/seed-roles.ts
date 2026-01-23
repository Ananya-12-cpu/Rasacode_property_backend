import { DataSource } from 'typeorm';
import { Role } from '../../entities/role.entity';
import { Permission } from '../../entities/permission.entity';
import { Plan, PlanType } from '../../entities/plan.entity';

export async function seedRoles(dataSource: DataSource) {
  const roleRepository = dataSource.getRepository(Role);
  const permissionRepository = dataSource.getRepository(Permission);
  const planRepository = dataSource.getRepository(Plan);

  console.log('🌱 Seeding roles and plans...');

  // Check if roles already exist
  const existingRoles = await roleRepository.find();
  if (existingRoles.length > 0) {
    console.log('⚠️  Roles already exist, skipping seed...');
    return;
  }

  // ==================== SUPER ADMIN ROLE ====================
  const superAdminRole = roleRepository.create({
    Name: 'super_admin',
    role_title: 'Super Admin',
  });
  await roleRepository.save(superAdminRole);

  const superAdminPermission = permissionRepository.create({
    role: superAdminRole,
    permissions: {
      campaign: {
        add: true,
        view: true,
        edit: true,
        delete: true,
      },
      properties: {
        add: true,
        view: true,
        edit: true,
        delete: true,
      },
    },
  });
  await permissionRepository.save(superAdminPermission);
  console.log('✅ Created super_admin role with full permissions');

  // ==================== BASIC USER ROLE ====================
  const basicUserRole = roleRepository.create({
    Name: 'basic_user',
    role_title: 'Basic User',
  });
  await roleRepository.save(basicUserRole);

  const basicUserPermission = permissionRepository.create({
    role: basicUserRole,
    permissions: {
      campaign: {
        add: false,
        view: true,
        edit: false,
        delete: false,
      },
      properties: {
        add: false,
        view: true,
        edit: false,
        delete: false,
      },
    },
  });
  await permissionRepository.save(basicUserPermission);
  console.log('✅ Created basic_user role with view-only permissions');

  // ==================== PRO USER ROLE ====================
  const proUserRole = roleRepository.create({
    Name: 'pro_user',
    role_title: 'Pro User',
  });
  await roleRepository.save(proUserRole);

  const proUserPermission = permissionRepository.create({
    role: proUserRole,
    permissions: {
      campaign: {
        add: true,
        view: true,
        edit: true,
        delete: false,
      },
      properties: {
        add: true,
        view: true,
        edit: true,
        delete: false,
      },
    },
  });
  await permissionRepository.save(proUserPermission);
  console.log('✅ Created pro_user role with add/edit permissions');

  // ==================== PROFESSIONAL USER ROLE ====================
  const professionalUserRole = roleRepository.create({
    Name: 'professional_user',
    role_title: 'Professional User',
  });
  await roleRepository.save(professionalUserRole);

  const professionalUserPermission = permissionRepository.create({
    role: professionalUserRole,
    permissions: {
      campaign: {
        add: true,
        view: true,
        edit: true,
        delete: true,
      },
      properties: {
        add: true,
        view: true,
        edit: true,
        delete: true,
      },
    },
  });
  await permissionRepository.save(professionalUserPermission);
  console.log('✅ Created professional_user role with full permissions');

  // ==================== SUBSCRIPTION PLANS ====================
  console.log('🌱 Seeding subscription plans...');

  // Basic Plan
  const basicPlan = planRepository.create({
    name: 'basic_plan',
    display_name: 'Basic Plan',
    description: 'Perfect for getting started. Access basic features.',
    price: 9.99,
    billing_cycle: 'monthly',
    plan_type: PlanType.BASIC,
    role: basicUserRole,
    is_active: true,
    features: [
      'View properties',
      'View campaigns',
      'Email support',
      'Basic analytics',
    ],
  });
  await planRepository.save(basicPlan);
  console.log('✅ Created Basic Plan');

  // Pro Plan
  const proPlan = planRepository.create({
    name: 'pro_plan',
    display_name: 'Pro Plan',
    description: 'For growing businesses. Add and edit capabilities.',
    price: 29.99,
    billing_cycle: 'monthly',
    plan_type: PlanType.PRO,
    role: proUserRole,
    is_active: true,
    features: [
      'All Basic features',
      'Add properties',
      'Add campaigns',
      'Edit properties',
      'Edit campaigns',
      'Priority support',
      'Advanced analytics',
    ],
  });
  await planRepository.save(proPlan);
  console.log('✅ Created Pro Plan');

  // Professional Plan
  const professionalPlan = planRepository.create({
    name: 'professional_plan',
    display_name: 'Professional Plan',
    description: 'Full access for professionals. All features unlocked.',
    price: 99.99,
    billing_cycle: 'monthly',
    plan_type: PlanType.PROFESSIONAL,
    role: professionalUserRole,
    is_active: true,
    features: [
      'All Pro features',
      'Delete properties',
      'Delete campaigns',
      'Dedicated support',
      'Custom integrations',
      'API access',
      'White-label options',
    ],
  });
  await planRepository.save(professionalPlan);
  console.log('✅ Created Professional Plan');

  console.log('🎉 Role and Plan seeding completed!');
}
